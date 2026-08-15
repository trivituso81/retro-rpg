import type { Facing } from '../config';
import type { InputState } from './input';

const DEAD_ZONE = 0.2; // 20% of radius

function dirFromVector(dx: number, dy: number, radius: number): Facing | null {
  const dist = Math.hypot(dx, dy);
  if (dist < radius * DEAD_ZONE) return null;
  // Snap to 4 directions — no diagonals (dominant axis)
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  }
  return dy > 0 ? 'down' : 'up';
}

/**
 * Virtual D-pad (DOM). Tracks a single finger; sliding between directions
 * updates without lifting. Lives in the letterbox / safe-area.
 */
export function bindTouchPad(
  pad: HTMLElement,
  knob: HTMLElement,
  input: InputState,
): () => void {
  let activeId: number | null = null;

  const syncKnob = (dx: number, dy: number, radius: number) => {
    const dist = Math.hypot(dx, dy);
    const max = radius * 0.45;
    const scale = dist > max && dist > 0 ? max / dist : 1;
    knob.style.transform = `translate(calc(-50% + ${dx * scale}px), calc(-50% + ${dy * scale}px))`;
  };

  const resetKnob = () => {
    knob.style.transform = 'translate(-50%, -50%)';
  };

  const read = (clientX: number, clientY: number) => {
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const radius = Math.min(rect.width, rect.height) / 2;
    input.touchDir = dirFromVector(dx, dy, radius);
    syncKnob(dx, dy, radius);
    pad.dataset.dir = input.touchDir ?? '';
  };

  const onStart = (e: TouchEvent) => {
    if (activeId !== null) return;
    const t = e.changedTouches[0];
    if (!t) return;
    e.preventDefault();
    activeId = t.identifier;
    read(t.clientX, t.clientY);
  };

  const onMove = (e: TouchEvent) => {
    if (activeId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]!;
      if (t.identifier === activeId) {
        e.preventDefault();
        read(t.clientX, t.clientY);
        break;
      }
    }
  };

  const onEnd = (e: TouchEvent) => {
    if (activeId === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]!;
      if (t.identifier === activeId) {
        e.preventDefault();
        activeId = null;
        input.touchDir = null;
        pad.dataset.dir = '';
        resetKnob();
        break;
      }
    }
  };

  const opts: AddEventListenerOptions = { passive: false };
  pad.addEventListener('touchstart', onStart, opts);
  pad.addEventListener('touchmove', onMove, opts);
  pad.addEventListener('touchend', onEnd, opts);
  pad.addEventListener('touchcancel', onEnd, opts);

  return () => {
    pad.removeEventListener('touchstart', onStart);
    pad.removeEventListener('touchmove', onMove);
    pad.removeEventListener('touchend', onEnd);
    pad.removeEventListener('touchcancel', onEnd);
  };
}
