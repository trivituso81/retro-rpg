/**
 * Player sprites from ArMM1998 character sheet (CC0).
 * Frames are 16×32; rows: down, right, up, left; cols: walk cycle.
 */

import {
  CHARACTER_URL,
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  type Facing,
} from '../config';

export type WalkFrame = 0 | 1 | 2; // neutral | left | right

export type SpriteSheet = {
  ready: boolean;
  draw(
    ctx: CanvasRenderingContext2D,
    facing: Facing,
    frame: WalkFrame,
    dx: number,
    dy: number,
  ): void;
};

const ROW: Record<Facing, number> = {
  down: 0,
  right: 1,
  up: 2,
  left: 3,
};

/** Map our 3-frame walk cycle onto the sheet's 4 columns. */
function colForFrame(frame: WalkFrame): number {
  if (frame === 0) return 0;
  if (frame === 1) return 1;
  return 3;
}

export function createSprites(): SpriteSheet {
  const image = new Image();
  image.decoding = 'async';
  let ready = false;

  image.onload = () => {
    ready = true;
  };
  image.onerror = () => {
    console.error(`Failed to load character ${CHARACTER_URL}`);
  };
  image.src = CHARACTER_URL;

  return {
    get ready() {
      return ready;
    },
    draw(ctx, facing, frame, dx, dy) {
      if (!ready) return;
      const row = ROW[facing];
      const col = colForFrame(frame);
      ctx.drawImage(
        image,
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
