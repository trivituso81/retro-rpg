import { DEBUG_FPS, MAX_FRAME_DELTA_MS, TICK_MS } from './config';
import {
  clearBuffer,
  createScreen,
  present,
  resizeScreen,
  type Screen,
} from './render/screen';

const canvas = document.getElementById('game');
if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('#game canvas not found');
}

const screen = createScreen(canvas);

let accumulator = 0;
let lastTime = performance.now();
let running = true;

// FPS tracking (debug)
let fpsFrames = 0;
let fpsElapsed = 0;
let fpsDisplay = 0;

function update(_dt: number): void {
  // Phase 1: no game state yet.
}

function drawFps(screen: Screen): void {
  if (!DEBUG_FPS) return;
  const { bufferCtx } = screen;
  bufferCtx.fillStyle = '#ffffff';
  bufferCtx.font = '8px monospace';
  bufferCtx.textBaseline = 'top';
  bufferCtx.fillText(`${fpsDisplay} FPS`, 4, 4);
}

function render(): void {
  clearBuffer(screen);
  // Phase 1: solid black frame + optional FPS.
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
