import type { Facing } from '../config';

export type Dir = Facing | null;

/** Shared direction intent from keyboard / (later) touch. */
export type InputState = {
  /** Held direction this frame (no diagonals). */
  dir: Dir;
};

export function createInputState(): InputState {
  return { dir: null };
}
