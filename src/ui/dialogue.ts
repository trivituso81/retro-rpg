/**
 * Classic JRPG dialogue box (bottom of screen).
 */

import { INTERNAL_HEIGHT, INTERNAL_WIDTH } from '../config';
import type { DialogueLine } from '../village/npcs';

export type DialogueState = {
  active: boolean;
  queue: DialogueLine[];
  index: number;
  /** Characters revealed in the current line (typewriter). */
  shown: number;
  /** Frames since last char. */
  timer: number;
};

export function createDialogue(): DialogueState {
  return {
    active: false,
    queue: [],
    index: 0,
    shown: 0,
    timer: 0,
  };
}

export function openDialogue(
  state: DialogueState,
  lines: DialogueLine[],
): void {
  if (lines.length === 0) return;
  state.active = true;
  state.queue = lines;
  state.index = 0;
  state.shown = 0;
  state.timer = 0;
}

export function closeDialogue(state: DialogueState): void {
  state.active = false;
  state.queue = [];
  state.index = 0;
  state.shown = 0;
  state.timer = 0;
}

const CHARS_PER_TICK = 1;
const TICKS_PER_CHAR = 2;

/** Advance typewriter; return true if line is fully shown. */
export function tickDialogue(state: DialogueState): boolean {
  if (!state.active) return true;
  const line = state.queue[state.index];
  if (!line) return true;
  if (state.shown >= line.text.length) return true;
  state.timer += 1;
  if (state.timer >= TICKS_PER_CHAR) {
    state.timer = 0;
    state.shown = Math.min(
      line.text.length,
      state.shown + CHARS_PER_TICK,
    );
  }
  return state.shown >= line.text.length;
}

/**
 * Confirm / advance. Returns true if dialogue fully closed.
 */
export function advanceDialogue(state: DialogueState): boolean {
  if (!state.active) return true;
  const line = state.queue[state.index];
  if (!line) {
    closeDialogue(state);
    return true;
  }
  if (state.shown < line.text.length) {
    state.shown = line.text.length;
    return false;
  }
  state.index += 1;
  if (state.index >= state.queue.length) {
    closeDialogue(state);
    return true;
  }
  state.shown = 0;
  state.timer = 0;
  return false;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const trial = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(trial).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = trial;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const BOX_H = 96;
const BOX_MARGIN = 12;
const PAD = 12;

export function drawDialogue(
  ctx: CanvasRenderingContext2D,
  state: DialogueState,
): void {
  if (!state.active) return;
  const line = state.queue[state.index];
  if (!line) return;

  const x = BOX_MARGIN;
  const y = INTERNAL_HEIGHT - BOX_H - BOX_MARGIN;
  const w = INTERNAL_WIDTH - BOX_MARGIN * 2;

  // Outer shadow
  ctx.fillStyle = '#0a0814';
  ctx.fillRect(x + 3, y + 3, w, BOX_H);

  // Frame
  ctx.fillStyle = '#1a1830';
  ctx.fillRect(x, y, w, BOX_H);
  ctx.strokeStyle = '#e8e0c8';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, BOX_H - 2);
  ctx.strokeStyle = '#8a7a50';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4, y + 4, w - 8, BOX_H - 8);

  // Speaker name plate
  ctx.fillStyle = '#2a2850';
  const nameW = Math.min(160, ctx.measureText(line.speaker).width + 24);
  ctx.fillRect(x + 10, y - 10, nameW, 18);
  ctx.strokeStyle = '#e8e0c8';
  ctx.strokeRect(x + 10, y - 10, nameW, 18);
  ctx.fillStyle = '#f0e8c0';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(line.speaker, x + 18, y - 1);

  // Body text with typewriter
  const visible = line.text.slice(0, state.shown);
  ctx.fillStyle = '#f8f4e8';
  ctx.font = '13px "Courier New", monospace';
  ctx.textBaseline = 'top';
  const wrapped = wrapText(ctx, visible, w - PAD * 2);
  let ty = y + PAD + 8;
  for (const row of wrapped.slice(0, 4)) {
    ctx.fillText(row, x + PAD, ty);
    ty += 16;
  }

  // Advance caret when line complete
  if (state.shown >= line.text.length) {
    const blink = Math.floor(performance.now() / 400) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#f0e8c0';
      ctx.beginPath();
      const cx = x + w - 18;
      const cy = y + BOX_H - 16;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 8, cy);
      ctx.lineTo(cx + 4, cy + 6);
      ctx.closePath();
      ctx.fill();
    }
  }
}
