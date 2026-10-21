/**
 * Tom sprite sheet loader (public/sprites/tom.png).
 * Layout: 3 cols (idle, walk1, walk2) × 4 rows (down, up, right, left)
 * + row 4 special (celebrate, talk, ready).
 */

import {
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  TOM_SPRITE_URL,
  type Facing,
} from '../config';

export type WalkFrame = 0 | 1 | 2; // idle | walk1 | walk2

export type SpriteSheet = {
  ready: boolean;
  canvas: HTMLCanvasElement;
  draw(
    ctx: CanvasRenderingContext2D,
    facing: Facing,
    frame: WalkFrame,
    dx: number,
    dy: number,
  ): void;
  drawSpecial(
    ctx: CanvasRenderingContext2D,
    pose: 'celebrate' | 'talk' | 'ready',
    dx: number,
    dy: number,
  ): void;
};

function slot(facing: Facing, frame: WalkFrame): { col: number; row: number } {
  const row =
    facing === 'down' ? 0 : facing === 'up' ? 1 : facing === 'right' ? 2 : 3;
  return { col: frame, row };
}

export function createSprites(): SpriteSheet {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_WIDTH * 3;
  canvas.height = SPRITE_HEIGHT * 5;
  const image = new Image();
  image.decoding = 'async';

  let ready = false;

  const sheet: SpriteSheet = {
    get ready() {
      return ready;
    },
    canvas,
    draw(dest, facing, frame, dx, dy) {
      if (!ready) return;
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
    drawSpecial(dest, pose, dx, dy) {
      if (!ready) return;
      const col = pose === 'celebrate' ? 0 : pose === 'talk' ? 1 : 2;
      dest.drawImage(
        canvas,
        col * SPRITE_WIDTH,
        4 * SPRITE_HEIGHT,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        dx,
        dy,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
      );
    },
  };

  image.onload = () => {
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ready = true;
  };
  image.onerror = () => {
    console.error(`Failed to load ${TOM_SPRITE_URL}`);
  };
  image.src = TOM_SPRITE_URL;

  return sheet;
}
