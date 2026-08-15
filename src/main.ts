import {
  DEBUG_FPS,
  DEFAULT_FACING,
  DEFAULT_SPAWN_X,
  DEFAULT_SPAWN_Y,
  MAX_FRAME_DELTA_MS,
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
import { createInputState } from './input/input';
import { bindKeyboard } from './input/keyboard';
import { bindTouchPad } from './input/touch';
import { cameraFollow, createCamera } from './render/camera';
import {
  clearBuffer,
  createScreen,
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
import { worldMap } from './world/map';

const canvas = document.getElementById('game');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#game canvas not found');
}

const pad = document.getElementById('dpad');
const knob = document.getElementById('dpad-knob');
if (!(pad instanceof HTMLElement) || !(knob instanceof HTMLElement)) {
  throw new Error('#dpad elements not found');
}
const dpad = pad;

const screen = createScreen(canvas);
const camera = createCamera();
const sprites = createSprites();
const input = createInputState();
bindKeyboard(input);
bindTouchPad(dpad, knob, input);

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

function update(_dt: number): void {
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

function drawPlayer(): void {
  const { x, y } = playerDrawPos(player);
  const dx = Math.round(x - camera.x);
  const dy = Math.round(y - camera.y);
  sprites.draw(screen.bufferCtx, player.facing, player.walkFrame, dx, dy);
}

function render(): void {
  clearBuffer(screen);
  if (tileset?.ready) {
    tileset.tick(nowMs);
    drawWorld(screen.bufferCtx, worldMap, tileset, camera, [
      {
        sortY: (player.tileY + 1) * TILE_SIZE + player.offsetY,
        draw: drawPlayer,
      },
    ]);
  }
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
      placePlayer(player, DEFAULT_SPAWN_X, DEFAULT_SPAWN_Y, DEFAULT_FACING);
      cameraFollow(camera, player.worldX, player.worldY);
    }
  };

  window.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      // Don't steal d-pad releases.
      if (dpad.contains(e.target as Node)) return;
      onTap(t.clientX, t.clientY);
    },
    { passive: true },
  );

  window.addEventListener('click', (e) => {
    onTap(e.clientX, e.clientY);
  });
}

bindResize();
bindResetGesture();
document.addEventListener('visibilitychange', onVisibilityChange);
window.addEventListener('pagehide', onPageHide);

requestAnimationFrame(frame);

createTileset()
  .then((ts) => {
    tileset = ts;
  })
  .catch((err) => {
    console.error(err);
  });
