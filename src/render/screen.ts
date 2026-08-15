import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  MIN_INTEGER_SCALE,
} from '../config';

export type Screen = {
  /** Visible (letterboxed) canvas. */
  display: HTMLCanvasElement;
  displayCtx: CanvasRenderingContext2D;
  /** Offscreen buffer at fixed internal resolution. */
  buffer: HTMLCanvasElement;
  bufferCtx: CanvasRenderingContext2D;
  /** Current scale factor applied when blitting buffer → display. */
  scale: number;
  /** Destination rect of the scaled buffer inside the display canvas. */
  destX: number;
  destY: number;
  destW: number;
  destH: number;
};

function disableSmoothing(ctx: CanvasRenderingContext2D): void {
  ctx.imageSmoothingEnabled = false;
}

export function createScreen(canvas: HTMLCanvasElement): Screen {
  const displayCtx = canvas.getContext('2d', { alpha: false });
  if (!displayCtx) {
    throw new Error('Failed to get 2D context for display canvas');
  }

  const buffer = document.createElement('canvas');
  buffer.width = INTERNAL_WIDTH;
  buffer.height = INTERNAL_HEIGHT;
  const bufferCtx = buffer.getContext('2d', { alpha: false });
  if (!bufferCtx) {
    throw new Error('Failed to get 2D context for internal buffer');
  }

  disableSmoothing(displayCtx);
  disableSmoothing(bufferCtx);

  const screen: Screen = {
    display: canvas,
    displayCtx,
    buffer,
    bufferCtx,
    scale: 1,
    destX: 0,
    destY: 0,
    destW: INTERNAL_WIDTH,
    destH: INTERNAL_HEIGHT,
  };

  resizeScreen(screen);
  return screen;
}

function viewportCssSize(): { cssW: number; cssH: number } {
  const vv = window.visualViewport;
  if (vv && vv.width > 0 && vv.height > 0) {
    return { cssW: vv.width, cssH: vv.height };
  }
  return { cssW: window.innerWidth, cssH: window.innerHeight };
}

/**
 * Scale the internal buffer into the viewport.
 * - Desktop / landscape: contain (letterbox), prefer near-integer scale.
 * - Phone / portrait: cover (fill the screen, crop edges) so the world
 *   isn't a tiny band with huge black bars.
 */
export function resizeScreen(screen: Screen): void {
  const dpr = window.devicePixelRatio || 1;
  const { cssW, cssH } = viewportCssSize();

  screen.display.width = Math.max(1, Math.round(cssW * dpr));
  screen.display.height = Math.max(1, Math.round(cssH * dpr));
  screen.display.style.width = `${cssW}px`;
  screen.display.style.height = `${cssH}px`;

  // Resizing a canvas clears imageSmoothingEnabled — reset it.
  disableSmoothing(screen.displayCtx);
  disableSmoothing(screen.bufferCtx);

  const fitX = screen.display.width / INTERNAL_WIDTH;
  const fitY = screen.display.height / INTERNAL_HEIGHT;
  const contain = Math.min(fitX, fitY);
  const cover = Math.max(fitX, fitY);

  // Narrow / tall phones: fill the whole screen (cover). Wide desktop: contain.
  const useCover = cssW < 900 || cssH / cssW > 1.1;
  let scale = useCover ? cover : contain;

  if (!useCover) {
    const integer = Math.floor(contain);
    if (integer >= MIN_INTEGER_SCALE && integer / contain >= 0.92) {
      scale = integer;
    }
  }
  if (scale < 1) {
    scale = useCover ? cover : contain;
  }

  const destW = Math.round(INTERNAL_WIDTH * scale);
  const destH = Math.round(INTERNAL_HEIGHT * scale);
  const destX = Math.floor((screen.display.width - destW) / 2);
  const destY = Math.floor((screen.display.height - destH) / 2);

  screen.scale = scale;
  screen.destX = destX;
  screen.destY = destY;
  screen.destW = destW;
  screen.destH = destH;
}

/** Clear internal buffer to black. */
export function clearBuffer(screen: Screen): void {
  const { bufferCtx } = screen;
  bufferCtx.fillStyle = '#000000';
  bufferCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
}

/**
 * Letterbox-blit the internal buffer onto the display canvas.
 * Display is filled black first so unused regions stay letterboxed.
 */
export function present(screen: Screen): void {
  const { displayCtx, buffer, destX, destY, destW, destH } = screen;
  displayCtx.fillStyle = '#000000';
  displayCtx.fillRect(0, 0, screen.display.width, screen.display.height);
  disableSmoothing(displayCtx);
  displayCtx.drawImage(buffer, destX, destY, destW, destH);
}
