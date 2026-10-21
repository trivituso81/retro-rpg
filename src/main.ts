import {
  DEBUG_FPS,
  DEFAULT_FACING,
  DEFAULT_SPAWN_X,
  DEFAULT_SPAWN_Y,
  MAX_FRAME_DELTA_MS,
  NPC_DRAW_SCALE,
  NPC_SPRITE_WIDTH,
  NPC_SPRITE_Y_OFFSET,
  RESET_TAP_WINDOW_MS,
  RESET_ZONE_SIZE,
  TILE_SIZE,
  TICK_MS,
} from './config';
import {
  createPlayer,
  placePlayer,
  playerDrawPos,
  updatePlayer,
} from './entity/player';
import { consumeConfirm, createInputState } from './input/input';
import { bindKeyboard } from './input/keyboard';
import { bindTouchPad } from './input/touch';
import { cameraFollow, createCamera } from './render/camera';
import { createNpcSprites } from './render/npcSprites';
import {
  clearBuffer,
  createScreen,
  isTouchPrimary,
  present,
  resizeScreen,
  type Screen,
} from './render/screen';
import { createSprites } from './render/sprites';
import { createTileset } from './render/tileset';
import { drawWorld } from './render/world';
import {
  clearSave,
  createSaveScheduler,
  defaultSave,
  loadSave,
  serializePlayer,
} from './save/persist';
import {
  advanceDialogue,
  createDialogue,
  drawDialogue,
  openDialogue,
  tickDialogue,
} from './ui/dialogue';
import { findBuildingInteract } from './village/buildings';
import {
  BUILDING_LINES,
  facingTile,
  nextNpcLines,
  npcAt,
  VILLAGE_NPCS,
  type NpcProgress,
} from './village/npcs';
import { worldMap } from './world/map';

const canvasEl = document.getElementById('game');
if (!(canvasEl instanceof HTMLCanvasElement)) {
  throw new Error('#game canvas not found');
}
const canvas = canvasEl;

const pad = document.getElementById('dpad');
const knob = document.getElementById('dpad-knob');
const talkEl = document.getElementById('btn-talk');
if (
  !(pad instanceof HTMLElement) ||
  !(knob instanceof HTMLElement) ||
  !(talkEl instanceof HTMLElement)
) {
  throw new Error('#dpad / #btn-talk elements not found');
}
const dpad = pad;
const talkBtn = talkEl;

const screen = createScreen(canvas);
const camera = createCamera();
const sprites = createSprites();
const npcSprites = createNpcSprites();
const input = createInputState();
const dialogue = createDialogue();
let npcProgress: NpcProgress = {};
/** When true, Tom flashes the celebrate pose briefly after a gag. */
let celebrateTimer = 0;

bindKeyboard(input);
bindTouchPad(dpad, knob, input);

talkBtn.addEventListener(
  'pointerdown',
  (e) => {
    e.preventDefault();
    talkBtn.dataset.pressed = '1';
    input.confirmPressed = true;
  },
  { passive: false },
);
const clearTalkPress = () => {
  talkBtn.dataset.pressed = '0';
};
talkBtn.addEventListener('pointerup', clearTalkPress);
talkBtn.addEventListener('pointercancel', clearTalkPress);
talkBtn.addEventListener('pointerleave', clearTalkPress);

/** Keep DOM chrome in sync with dialogue (iPhone NEXT bar, hide D-pad). */
let chromeOpen: boolean | null = null;
function syncDialogueChrome(): void {
  const open = dialogue.active;
  if (chromeOpen === open) return;
  chromeOpen = open;
  document.body.classList.toggle('dialogue-open', open);
  talkBtn.textContent = open ? 'NEXT' : 'TALK';
  talkBtn.setAttribute('aria-label', open ? 'Next' : 'Talk');
}

/** iOS Safari sometimes offsets visualViewport — pin it. */
function pinIosViewport(): void {
  const vv = window.visualViewport;
  if (!vv) return;
  if (vv.offsetTop !== 0 || vv.offsetLeft !== 0) {
    window.scrollTo(0, 0);
  }
}

/** Tap the game canvas to talk / advance (handy on iPhone). */
function bindCanvasTap(): void {
  const onTap = (clientX: number, clientY: number, target: EventTarget | null) => {
    if (target instanceof Node) {
      if (dpad.contains(target) || talkBtn.contains(target)) return;
    }
    // Ignore top-right reset zone taps.
    const w = window.visualViewport?.width ?? window.innerWidth;
    if (clientX >= w - RESET_ZONE_SIZE && clientY <= RESET_ZONE_SIZE) return;
    input.confirmPressed = true;
  };

  canvas.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      // Don't steal multi-touch from the pad.
      if (dpad.contains(e.target as Node)) return;
      e.preventDefault();
      onTap(t.clientX, t.clientY, e.target);
    },
    { passive: false },
  );
}

const saved = loadSave(worldMap) ?? defaultSave();
const player = createPlayer(saved.x, saved.y, saved.facing);

const save = createSaveScheduler(() => serializePlayer(player));

cameraFollow(camera, player.worldX, player.worldY);

let accumulator = 0;
let lastTime = performance.now();
let running = true;
let nowMs = 0;
let tileset: Awaited<ReturnType<typeof createTileset>> | null = null;

let fpsFrames = 0;
let fpsElapsed = 0;
let fpsDisplay = 0;

function talkToNpc(npc: (typeof VILLAGE_NPCS)[number]): void {
  const dx = player.tileX - npc.tileX;
  const dy = player.tileY - npc.tileY;
  if (Math.abs(dx) > Math.abs(dy)) {
    npc.facing = dx > 0 ? 'right' : 'left';
  } else if (dy !== 0) {
    npc.facing = dy > 0 ? 'down' : 'up';
  }
  const result = nextNpcLines(npc, npcProgress);
  npcProgress = result.progress;
  openDialogue(dialogue, result.lines);
  celebrateTimer = 90;
}

function tryInteract(): void {
  const front = facingTile(player.tileX, player.tileY, player.facing);

  const faced = npcAt(VILLAGE_NPCS, front.x, front.y);
  if (faced) {
    talkToNpc(faced);
    return;
  }

  // Forgiving PoC: talk if standing beside an NPC (auto-face them).
  const neighbors: Array<{ x: number; y: number; facing: typeof player.facing }> =
    [
      { x: player.tileX, y: player.tileY - 1, facing: 'up' },
      { x: player.tileX, y: player.tileY + 1, facing: 'down' },
      { x: player.tileX - 1, y: player.tileY, facing: 'left' },
      { x: player.tileX + 1, y: player.tileY, facing: 'right' },
    ];
  for (const n of neighbors) {
    const npc = npcAt(VILLAGE_NPCS, n.x, n.y);
    if (npc) {
      player.facing = n.facing;
      talkToNpc(npc);
      return;
    }
  }

  const building = findBuildingInteract(worldMap.buildings, front.x, front.y);
  if (building) {
    const lines = BUILDING_LINES[building.label];
    if (lines) {
      openDialogue(dialogue, lines);
      return;
    }
  }

  const here = findBuildingInteract(
    worldMap.buildings,
    player.tileX,
    player.tileY,
  );
  if (here) {
    const lines = BUILDING_LINES[here.label];
    if (lines) openDialogue(dialogue, lines);
  }
}

function update(_dt: number): void {
  const confirmed = consumeConfirm(input);
  const wasOpen = dialogue.active;

  if (dialogue.active) {
    tickDialogue(dialogue);
    if (confirmed) {
      const closed = advanceDialogue(dialogue);
      if (closed) celebrateTimer = Math.max(celebrateTimer, 45);
    }
    if (wasOpen !== dialogue.active) syncDialogueChrome();
    return;
  }

  if (confirmed) tryInteract();
  if (wasOpen !== dialogue.active) syncDialogueChrome();

  if (celebrateTimer > 0) celebrateTimer -= 1;

  const { landed } = updatePlayer(player, input, worldMap);
  cameraFollow(camera, player.worldX, player.worldY);
  if (landed) save.schedule();
}

function drawFps(target: Screen): void {
  if (!DEBUG_FPS) return;
  const { bufferCtx } = target;
  bufferCtx.fillStyle = '#ffffff';
  bufferCtx.font = '16px monospace';
  bufferCtx.textBaseline = 'top';
  bufferCtx.fillText(`${fpsDisplay} FPS`, 4, 4);
}

function drawTitle(target: Screen): void {
  const { bufferCtx } = target;
  const y = DEBUG_FPS ? 24 : 6;
  bufferCtx.fillStyle = 'rgba(0,0,0,0.35)';
  bufferCtx.fillRect(4, y - 2, 140, 20);
  bufferCtx.fillStyle = '#f0e8c0';
  bufferCtx.font = 'bold 14px "Courier New", monospace';
  bufferCtx.textBaseline = 'top';
  bufferCtx.fillText("Tom's Village", 10, y);
}

function drawPlayer(): void {
  const { x, y } = playerDrawPos(player);
  const dx = Math.round(x - camera.x);
  const dy = Math.round(y - camera.y);
  if (dialogue.active) {
    sprites.drawSpecial(screen.bufferCtx, 'talk', dx, dy);
  } else if (celebrateTimer > 0 && celebrateTimer % 20 < 12) {
    sprites.drawSpecial(screen.bufferCtx, 'celebrate', dx, dy);
  } else {
    sprites.draw(screen.bufferCtx, player.facing, player.walkFrame, dx, dy);
  }
}

/** Y-sort Tom + NPCs for simple depth. */
function drawActors(): void {
  type Actor =
    | { kind: 'player'; y: number }
    | { kind: 'npc'; y: number; index: number };

  const actors: Actor[] = [
    { kind: 'player', y: player.tileY * TILE_SIZE + player.offsetY },
  ];
  VILLAGE_NPCS.forEach((npc, index) => {
    actors.push({ kind: 'npc', y: npc.tileY * TILE_SIZE, index });
  });
  actors.sort((a, b) => a.y - b.y);

  const drawW = NPC_SPRITE_WIDTH * NPC_DRAW_SCALE;

  for (const a of actors) {
    if (a.kind === 'player') {
      drawPlayer();
    } else {
      const npc = VILLAGE_NPCS[a.index]!;
      const x =
        npc.tileX * TILE_SIZE + (TILE_SIZE - drawW) / 2 - camera.x;
      const y = npc.tileY * TILE_SIZE - NPC_SPRITE_Y_OFFSET - camera.y;
      npcSprites.draw(
        screen.bufferCtx,
        npc.palette,
        npc.facing,
        Math.round(x),
        Math.round(y),
        NPC_DRAW_SCALE,
      );
    }
  }
}

function render(): void {
  syncDialogueChrome();
  clearBuffer(screen);
  if (tileset?.ready) {
    tileset.tick(nowMs);
    drawWorld(screen.bufferCtx, worldMap, tileset, camera);
    drawActors();
  }
  drawTitle(screen);
  // Lift dialogue above thumb controls on iPhone / touch devices.
  const reserve = isTouchPrimary() ? 72 : 0;
  drawDialogue(screen.bufferCtx, dialogue, reserve);
  drawFps(screen);
  present(screen);
}

function frame(now: number): void {
  requestAnimationFrame(frame);

  if (!running) {
    lastTime = now;
    return;
  }

  let delta = now - lastTime;
  lastTime = now;
  if (delta > MAX_FRAME_DELTA_MS) {
    delta = MAX_FRAME_DELTA_MS;
  }

  nowMs = now;
  accumulator += delta;
  while (accumulator >= TICK_MS) {
    update(TICK_MS);
    accumulator -= TICK_MS;
  }

  if (DEBUG_FPS) {
    fpsFrames += 1;
    fpsElapsed += delta;
    if (fpsElapsed >= 500) {
      fpsDisplay = Math.round((fpsFrames * 1000) / fpsElapsed);
      fpsFrames = 0;
      fpsElapsed = 0;
    }
  }

  render();
}

function onVisibilityChange(): void {
  if (document.hidden) {
    running = false;
    save.flush();
  } else {
    running = true;
    accumulator = 0;
    lastTime = performance.now();
  }
}

function onPageHide(): void {
  save.flush();
}

function bindResize(): void {
  const doResize = () => resizeScreen(screen);
  window.addEventListener('resize', doResize);
  window.addEventListener('orientationchange', doResize);
  window.visualViewport?.addEventListener('resize', doResize);
  window.visualViewport?.addEventListener('scroll', doResize);
}

/** Triple-tap top-right corner → clear save and respawn. */
function bindResetGesture(): void {
  const taps: number[] = [];

  const inZone = (clientX: number, clientY: number) => {
    const w = window.visualViewport?.width ?? window.innerWidth;
    return clientX >= w - RESET_ZONE_SIZE && clientY <= RESET_ZONE_SIZE;
  };

  const onTap = (clientX: number, clientY: number) => {
    if (!inZone(clientX, clientY)) {
      taps.length = 0;
      return;
    }
    const now = performance.now();
    taps.push(now);
    while (taps.length > 0 && now - taps[0]! > RESET_TAP_WINDOW_MS) {
      taps.shift();
    }
    if (taps.length >= 3) {
      taps.length = 0;
      clearSave();
      save.cancel();
      npcProgress = {};
      placePlayer(player, DEFAULT_SPAWN_X, DEFAULT_SPAWN_Y, DEFAULT_FACING);
      cameraFollow(camera, player.worldX, player.worldY);
      celebrateTimer = 0;
    }
  };

  window.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      if (dpad.contains(e.target as Node)) return;
      if (talkBtn.contains(e.target as Node)) return;
      onTap(t.clientX, t.clientY);
    },
    { passive: true },
  );

  window.addEventListener('click', (e) => {
    if (talkBtn.contains(e.target as Node)) return;
    onTap(e.clientX, e.clientY);
  });
}

bindResize();
bindResetGesture();
bindCanvasTap();
syncDialogueChrome();
document.addEventListener('visibilitychange', onVisibilityChange);
window.addEventListener('pagehide', onPageHide);
window.visualViewport?.addEventListener('resize', pinIosViewport);
window.visualViewport?.addEventListener('scroll', pinIosViewport);
window.addEventListener('orientationchange', () => {
  pinIosViewport();
  resizeScreen(screen);
});

requestAnimationFrame(frame);

createTileset()
  .then((ts) => {
    tileset = ts;
  })
  .catch((err) => {
    console.error(err);
  });

// Dev/test probe (Playwright / console).
(window as unknown as { __TOM__: unknown }).__TOM__ = {
  get player() {
    return {
      x: player.tileX,
      y: player.tileY,
      facing: player.facing,
      state: player.state,
    };
  },
  get dialogue() {
    return {
      active: dialogue.active,
      index: dialogue.index,
      shown: dialogue.shown,
      speaker: dialogue.queue[dialogue.index]?.speaker ?? null,
      line: dialogue.queue[dialogue.index]?.text ?? null,
    };
  },
  npcs: () =>
    VILLAGE_NPCS.map((n) => ({
      id: n.id,
      x: n.tileX,
      y: n.tileY,
    })),
  place: (x: number, y: number, facing: typeof player.facing) => {
    placePlayer(player, x, y, facing);
    cameraFollow(camera, player.worldX, player.worldY);
  },
  interact: () => tryInteract(),
  advance: () => advanceDialogue(dialogue),
};
