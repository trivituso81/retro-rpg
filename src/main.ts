import { DEBUG_FPS, MAX_FRAME_DELTA_MS, TICK_MS } from './config';
import {
  createPlayer,
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

const screen = createScreen(canvas);
const camera = createCamera();
const sprites = createSprites();
const input = createInputState();
bindKeyboard(input);
bindTouchPad(pad, knob, input);
const player = createPlayer();

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
  updatePlayer(player, input, worldMap);
  cameraFollow(camera, player.worldX, player.worldY);
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
    drawWorld(screen.bufferCtx, worldMap, tileset, camera);
    drawPlayer();
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
  } else {
    running = true;
    accumulator = 0;
    lastTime = performance.now();
  }
}

window.addEventListener('resize', () => resizeScreen(screen));
window.addEventListener('orientationchange', () => resizeScreen(screen));
document.addEventListener('visibilitychange', onVisibilityChange);

requestAnimationFrame(frame);

createTileset()
  .then((ts) => {
    tileset = ts;
  })
  .catch((err) => {
    console.error(err);
  });
