/**
 * Procedural character sprite sheet (16×24).
 * 4 directions × 3 frames (neutral, step-left, step-right).
 * Left-facing is right-facing mirrored.
 */

import {
  PALETTE,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  type Facing,
} from '../config';

export type WalkFrame = 0 | 1 | 2; // neutral | left | right

export type SpriteSheet = {
  canvas: HTMLCanvasElement;
  draw(
    ctx: CanvasRenderingContext2D,
    facing: Facing,
    frame: WalkFrame,
    dx: number,
    dy: number,
  ): void;
};

function hex(i: number): string {
  return PALETTE[i] ?? PALETTE[0];
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
): void {
  if (x < 0 || y < 0 || x >= SPRITE_WIDTH || y >= SPRITE_HEIGHT) return;
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, 1, 1);
}

/** Outline helper: draw dark ring around opaque body later via second pass. */
function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  facing: Facing,
  frame: WalkFrame,
  mirror: boolean,
): void {
  const put = (x: number, y: number, c: number) => {
    const xx = mirror ? SPRITE_WIDTH - 1 - x : x;
    px(ctx, xx, y, c);
  };

  // Feet offset for walk cycle
  let footL = 0;
  let footR = 0;
  if (frame === 1) {
    footL = facing === 'left' || facing === 'right' ? -1 : -1;
    footR = 1;
  } else if (frame === 2) {
    footL = 1;
    footR = facing === 'left' || facing === 'right' ? -1 : -1;
  }

  // Boots / legs (bottom of sprite)
  const legY = 20;
  put(5, legY + footL, 17);
  put(6, legY + footL, 17);
  put(5, legY + 1 + footL, 0);
  put(6, legY + 1 + footL, 0);
  put(9, legY + footR, 17);
  put(10, legY + footR, 17);
  put(9, legY + 1 + footR, 0);
  put(10, legY + 1 + footR, 0);

  // Tunic body
  for (let y = 11; y <= 19; y++) {
    for (let x = 4; x <= 11; x++) {
      put(x, y, 18);
    }
  }
  // Belt
  for (let x = 4; x <= 11; x++) put(x, 16, 17);
  // Tunic highlight
  put(5, 12, 19);
  put(6, 13, 19);

  // Head
  for (let y = 4; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) {
      put(x, y, 15); // skin/sand tone
    }
  }

  // Dark hair
  for (let y = 3; y <= 6; y++) {
    for (let x = 4; x <= 11; x++) {
      if (y === 3 || x === 4 || x === 11 || (y <= 5 && x >= 5 && x <= 10)) {
        put(x, y, 0);
      }
    }
  }
  for (let x = 5; x <= 10; x++) put(x, 3, 0);
  for (let x = 4; x <= 11; x++) put(x, 4, 0);
  put(4, 5, 0);
  put(11, 5, 0);
  put(4, 6, 0);
  put(11, 6, 0);

  // Eyes only on down-facing
  if (facing === 'down') {
    put(6, 7, 0);
    put(9, 7, 0);
  }

  // Arms — shift slightly with walk
  const armShift = frame === 1 ? 1 : frame === 2 ? -1 : 0;
  if (facing === 'down' || facing === 'up') {
    put(3, 12 + armShift, 15);
    put(3, 13 + armShift, 18);
    put(12, 12 - armShift, 15);
    put(12, 13 - armShift, 18);
  } else {
    // Side view: one arm forward
    put(3, 12, 15);
    put(3, 13, 18);
    put(12, 12, 15);
    put(12, 13, 18);
  }

  // Facing-up: darker hair covers more of face
  if (facing === 'up') {
    for (let y = 5; y <= 8; y++) {
      for (let x = 5; x <= 10; x++) put(x, y, 0);
    }
  }
}

function outlineFrame(ctx: CanvasRenderingContext2D): void {
  const img = ctx.getImageData(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  const d = img.data;
  const solid = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= SPRITE_WIDTH || y >= SPRITE_HEIGHT) return false;
    return d[(y * SPRITE_WIDTH + x) * 4 + 3]! > 0;
  };
  const out: Array<[number, number]> = [];
  for (let y = 0; y < SPRITE_HEIGHT; y++) {
    for (let x = 0; x < SPRITE_WIDTH; x++) {
      if (!solid(x, y)) continue;
      if (
        !solid(x - 1, y) ||
        !solid(x + 1, y) ||
        !solid(x, y - 1) ||
        !solid(x, y + 1)
      ) {
        out.push([x, y]);
      }
    }
  }
  // Re-draw outline on edge pixels (darken)
  for (const [x, y] of out) {
    // Only outline if neighbor empty — draw into empty neighbor cells
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ] as const) {
      if (!solid(nx, ny) && nx >= 0 && ny >= 0 && nx < SPRITE_WIDTH && ny < SPRITE_HEIGHT) {
        px(ctx, nx, ny, 0);
      }
    }
  }
}

const FACING_ORDER: Facing[] = ['down', 'up', 'right']; // left = mirrored right

function slot(facing: Facing, frame: WalkFrame): { col: number; row: number } {
  // rows: down=0, up=1, right=2, left=3 (mirrored from right at draw time, or stored)
  const row = facing === 'down' ? 0 : facing === 'up' ? 1 : facing === 'right' ? 2 : 3;
  return { col: frame, row };
}

export function createSprites(): SpriteSheet {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_WIDTH * 3;
  canvas.height = SPRITE_HEIGHT * 4;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const temp = document.createElement('canvas');
  temp.width = SPRITE_WIDTH;
  temp.height = SPRITE_HEIGHT;
  const tctx = temp.getContext('2d')!;
  tctx.imageSmoothingEnabled = false;

  const paint = (facing: Facing, frame: WalkFrame, mirror: boolean) => {
    tctx.clearRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
    drawSilhouette(tctx, facing, frame, mirror);
    outlineFrame(tctx);
    const { col, row } = slot(facing, frame);
    ctx.clearRect(
      col * SPRITE_WIDTH,
      row * SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
    );
    ctx.drawImage(temp, col * SPRITE_WIDTH, row * SPRITE_HEIGHT);
  };

  for (const facing of FACING_ORDER) {
    for (let f = 0 as WalkFrame; f <= 2; f = (f + 1) as WalkFrame) {
      paint(facing, f, false);
    }
  }

  // Left = mirror of right poses
  for (let f = 0 as WalkFrame; f <= 2; f = (f + 1) as WalkFrame) {
    paint('left', f, true);
  }

  return {
    canvas,
    draw(dest, facing, frame, dx, dy) {
      const { col, row } = slot(facing, frame);
      dest.drawImage(
        canvas,
        col * SPRITE_WIDTH,
        row * SPRITE_HEIGHT,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        dx,
        dy,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
      );
    },
  };
}
