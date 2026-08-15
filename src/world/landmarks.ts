/**
 * Multi-tile landmarks from the ArMM1998 overworld atlas.
 * Visual sprites are taller than the 2×2 map footprint and overhang north.
 */

import { LANDMARK_SIZE, TILE_SIZE, TileId, type TileIdValue } from '../config';

export type LandmarkKind = 'town' | 'castle' | 'cave';

export type Landmark = {
  kind: LandmarkKind;
  /** Northwest tile of the 2×2 ground footprint. */
  x: number;
  y: number;
  destination: string;
};

const LANDMARK_TILES: TileIdValue[] = [
  TileId.Town,
  TileId.Castle,
  TileId.Cave,
];

export function isLandmarkTile(id: TileIdValue): boolean {
  return LANDMARK_TILES.includes(id);
}

export function kindFromTile(id: TileIdValue): LandmarkKind | null {
  if (id === TileId.Town) return 'town';
  if (id === TileId.Castle) return 'castle';
  if (id === TileId.Cave) return 'cave';
  return null;
}

export function isLandmarkCoverage(
  landmarks: readonly Landmark[],
  x: number,
  y: number,
): boolean {
  for (const lm of landmarks) {
    if (x === lm.x && y === lm.y) return false;
    if (
      x >= lm.x &&
      x < lm.x + LANDMARK_SIZE &&
      y >= lm.y &&
      y < lm.y + LANDMARK_SIZE
    ) {
      return true;
    }
  }
  return false;
}

export function findLandmarkAt(
  landmarks: readonly Landmark[],
  x: number,
  y: number,
): Landmark | null {
  for (const lm of landmarks) {
    if (
      x >= lm.x &&
      x < lm.x + LANDMARK_SIZE &&
      y >= lm.y &&
      y < lm.y + LANDMARK_SIZE
    ) {
      return lm;
    }
  }
  return null;
}

type Src = { tx: number; ty: number };

function blit(
  dest: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  src: Src,
  dx: number,
  dy: number,
): void {
  dest.drawImage(
    sheet,
    src.tx * TILE_SIZE,
    src.ty * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    dx,
    dy,
    TILE_SIZE,
    TILE_SIZE,
  );
}

/** House front from atlas cols 6–9, rows 0–4 (4×5). */
function bakeTown(sheet: HTMLImageElement): HTMLCanvasElement {
  const w = 4;
  const h = 5;
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * w;
  c.height = TILE_SIZE * h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  for (let oy = 0; oy < h; oy++) {
    for (let ox = 0; ox < w; ox++) {
      blit(ctx, sheet, { tx: 6 + ox, ty: 0 + oy }, ox * TILE_SIZE, oy * TILE_SIZE);
    }
  }
  return c;
}

/**
 * Castle keep: tower pieces + roof from the stone architecture block.
 * 4×6 visual; bottom 2 rows are the walkable/solid footprint.
 */
function bakeCastle(sheet: HTMLImageElement): HTMLCanvasElement {
  const w = 4;
  const h = 6;
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * w;
  c.height = TILE_SIZE * h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Roof / dome row
  blit(ctx, sheet, { tx: 2, ty: 24 }, 8, 0);
  blit(ctx, sheet, { tx: 3, ty: 24 }, 24, 0);
  blit(ctx, sheet, { tx: 2, ty: 24 }, 40, 0);

  // Upper tower walls
  for (let row = 0; row < 3; row++) {
    blit(ctx, sheet, { tx: 0, ty: 25 + (row % 2) }, 0, (1 + row) * TILE_SIZE);
    blit(ctx, sheet, { tx: 1, ty: 25 + (row % 2) }, 16, (1 + row) * TILE_SIZE);
    blit(ctx, sheet, { tx: 0, ty: 25 + (row % 2) }, 32, (1 + row) * TILE_SIZE);
    blit(ctx, sheet, { tx: 1, ty: 25 + (row % 2) }, 48, (1 + row) * TILE_SIZE);
  }

  // Gate / base
  blit(ctx, sheet, { tx: 0, ty: 26 }, 0, 4 * TILE_SIZE);
  blit(ctx, sheet, { tx: 4, ty: 31 }, 16, 4 * TILE_SIZE);
  blit(ctx, sheet, { tx: 5, ty: 31 }, 32, 4 * TILE_SIZE);
  blit(ctx, sheet, { tx: 1, ty: 26 }, 48, 4 * TILE_SIZE);

  blit(ctx, sheet, { tx: 0, ty: 27 }, 0, 5 * TILE_SIZE);
  blit(ctx, sheet, { tx: 4, ty: 32 }, 16, 5 * TILE_SIZE);
  blit(ctx, sheet, { tx: 5, ty: 32 }, 32, 5 * TILE_SIZE);
  blit(ctx, sheet, { tx: 1, ty: 27 }, 48, 5 * TILE_SIZE);

  // Dark doorway
  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(26, 5 * TILE_SIZE + 4, 12, 12);

  return c;
}

/** Cave mouth 2×2 from rocky atlas cells. */
function bakeCave(sheet: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * 2;
  c.height = TILE_SIZE * 2;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  blit(ctx, sheet, { tx: 14, ty: 14 }, 0, 0);
  blit(ctx, sheet, { tx: 15, ty: 14 }, 16, 0);
  blit(ctx, sheet, { tx: 14, ty: 15 }, 0, 16);
  blit(ctx, sheet, { tx: 15, ty: 15 }, 16, 16);
  ctx.fillStyle = '#080810';
  ctx.fillRect(10, 14, 12, 14);
  return c;
}

export type LandmarkSprites = {
  town: HTMLCanvasElement;
  castle: HTMLCanvasElement;
  cave: HTMLCanvasElement;
};

/** How many tiles the sprite extends above the footprint top. */
export const LANDMARK_OVERHANG: Record<LandmarkKind, number> = {
  town: 3, // 5 tall − 2 footprint
  castle: 4, // 6 tall − 2 footprint
  cave: 0,
};

export function bakeLandmarks(sheet: HTMLImageElement): LandmarkSprites {
  return {
    town: bakeTown(sheet),
    castle: bakeCastle(sheet),
    cave: bakeCave(sheet),
  };
}

export function drawLandmarkSprite(
  ctx: CanvasRenderingContext2D,
  sprites: LandmarkSprites,
  kind: LandmarkKind,
  /** Top-left of the 2×2 footprint in screen pixels. */
  dx: number,
  dy: number,
): void {
  const spr = sprites[kind];
  const overhang = LANDMARK_OVERHANG[kind] * TILE_SIZE;
  // Center wider sprites on the 2×2 footprint
  const extraW = spr.width - LANDMARK_SIZE * TILE_SIZE;
  ctx.drawImage(spr, dx - Math.floor(extraW / 2), dy - overhang);
}

/** Sort key = bottom of footprint (world pixels). */
export function landmarkSortY(lm: Landmark): number {
  return (lm.y + LANDMARK_SIZE) * TILE_SIZE;
}
