import {
  DEBUG_FPS,
  MAX_FRAME_DELTA_MS,
  PHASE2_CAMERA_TILE_X,
  PHASE2_CAMERA_TILE_Y,
  TILE_SIZE,
  TICK_MS,
} from './config';
import { cameraFollow, createCamera } from './render/camera';
import {
  clearBuffer,
  createScreen,
  present,
  resizeScreen,
  type Screen,
} from './render/screen';
import { createTileset } from './render/tileset';
import { drawWorld } from './render/world';
import { worldMap } from './world/map';

const canvas = document.getElementById('game');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#game canvas not found');
}

const screen = createScreen(canvas);
const camera = createCamera();

cameraFollow(
  camera,
  PHASE2_CAMERA_TILE_X * TILE_SIZE + TILE_SIZE / 2,
  PHASE2_CAMERA_TILE_Y * TILE_SIZE + TILE_SIZE / 2,
);

let accumulator = 0;
let lastTime = performance.now();
let running = true;
let nowMs = 0;
let tileset: Awaited<ReturnType<typeof createTileset>> | null = null;

let fpsFrames = 0;
let fpsElapsed = 0;
let fpsDisplay = 0;

function update(_dt: number): void {
  // Phase 2: no player yet.
}

function drawFps(target: Screen): void {
  if (!DEBUG_FPS) return;
  const { bufferCtx } = target;
  bufferCtx.fillStyle = '#ffffff';
  bufferCtx.font = '16px monospace';
  bufferCtx.textBaseline = 'top';
  bufferCtx.fillText(`${fpsDisplay} FPS`, 4, 4);
}

function render(): void {
  clearBuffer(screen);
  if (tileset?.ready) {
    tileset.tick(nowMs);
    drawWorld(screen.bufferCtx, worldMap, tileset, camera);
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
document.addEventListener('visibilitychange', onVisibilityChange);

requestAnimationFrame(frame);

createTileset()
  .then((ts) => {
    tileset = ts;
  })
  .catch((err) => {
    console.error(err);
  });
