import type { Facing } from '../config';

export type Dir = Facing | null;

/** Shared direction intent from keyboard + touch. */
export type InputState = {
  keyboardDir: Dir;
  touchDir: Dir;
  /** Edge-triggered confirm / talk (Space, Enter, Z, or Talk button). */
  confirmPressed: boolean;
};

export function createInputState(): InputState {
  return { keyboardDir: null, touchDir: null, confirmPressed: false };
}

/** Touch overrides keyboard while a thumb is on the pad. */
export function activeDir(input: InputState): Dir {
  return input.touchDir ?? input.keyboardDir;
}

/** Consume a one-frame confirm press. */
export function consumeConfirm(input: InputState): boolean {
  if (!input.confirmPressed) return false;
  input.confirmPressed = false;
  return true;
}
