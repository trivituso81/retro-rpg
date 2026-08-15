import type { Facing } from '../config';
import type { InputState } from './input';

const KEY_TO_DIR: Record<string, Facing> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

/**
 * Keyboard → input state. Last pressed direction wins while held;
 * releasing falls back to any other still-held key.
 */
export function bindKeyboard(input: InputState): () => void {
  const held = new Set<Facing>();
  const heldOrder: Facing[] = [];

  const sync = () => {
    input.keyboardDir =
      heldOrder.length > 0 ? heldOrder[heldOrder.length - 1]! : null;
  };

  const onDown = (e: KeyboardEvent) => {
    const dir = KEY_TO_DIR[e.key];
    if (!dir) return;
    e.preventDefault();
    if (!held.has(dir)) {
      held.add(dir);
      heldOrder.push(dir);
    }
    sync();
  };

  const onUp = (e: KeyboardEvent) => {
    const dir = KEY_TO_DIR[e.key];
    if (!dir) return;
    e.preventDefault();
    held.delete(dir);
    const idx = heldOrder.indexOf(dir);
    if (idx >= 0) heldOrder.splice(idx, 1);
    sync();
  };

  window.addEventListener('keydown', onDown, { passive: false });
  window.addEventListener('keyup', onUp, { passive: false });

  return () => {
    window.removeEventListener('keydown', onDown);
    window.removeEventListener('keyup', onUp);
  };
}
