import type { Facing } from '../config';

export type Dir = Facing | null;

/** Shared direction intent from keyboard + touch. */
export type InputState = {
  keyboardDir: Dir;
  touchDir: Dir;
};

export function createInputState(): InputState {
  return { keyboardDir: null, touchDir: null };
}

/** Touch overrides keyboard while a thumb is on the pad. */
export function activeDir(input: InputState): Dir {
  return input.touchDir ?? input.keyboardDir;
}
