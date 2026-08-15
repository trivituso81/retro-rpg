/** All tunable constants in one place. */

export const INTERNAL_WIDTH = 256;
export const INTERNAL_HEIGHT = 224;

/** Fixed logic rate (Hz). */
export const TICK_RATE = 60;
export const TICK_MS = 1000 / TICK_RATE;

/** Clamp frame delta to avoid spiral-of-death after backgrounding. */
export const MAX_FRAME_DELTA_MS = 100;

/** Show FPS counter in the corner when true. */
export const DEBUG_FPS = true;

/** Minimum preferred integer scale; fall back to fractional below this. */
export const MIN_INTEGER_SCALE = 2;
