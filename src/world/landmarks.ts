/**
 * 2×2 enterable landmarks (town / castle / cave).
 * Built from Puny World atlas cells with grass/black keyed out so they
 * sit on the same grass as the plains.
 */

import { LANDMARK_SIZE, TILE_SIZE, TileId, type TileIdValue } from '../config';

export type LandmarkKind = 'town' | 'castle' | 'cave';

export type Landmark = {
  kind: LandmarkKind;
  /** Northwest tile of the 2×2 footprint. */
  x: number;
  y: number;
  /** Destination id for a future interior warp (Phase 3+). */
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

/** True if (x,y) is inside a landmark footprint but not the NW anchor. */
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

function isKeyedOut(r: number, g: number, b: number, a: number): boolean {
  if (a < 20) return true;
  // Near-black atlas padding
  if (r + g + b < 40) return true;
  // Flat grass / olive fill baked into Puny World building tiles
  if (g > r + 15 && g > b + 15 && g > 90 && g < 200 && r < 160 && b < 120) {
    return true;
  }
  return false;
}

/** Copy one atlas cell onto dest, skipping grass/black key pixels. */
function stampKeyed(
  dest: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  src: Src,
  dx: number,
  dy: number,
): void {
  const tmp = document.createElement('canvas');
  tmp.width = TILE_SIZE;
  tmp.height = TILE_SIZE;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  if (!tctx) return;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(
    sheet,
    src.tx * TILE_SIZE,
    src.ty * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    0,
    0,
    TILE_SIZE,
    TILE_SIZE,
  );
  const data = tctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    if (isKeyedOut(d[i]!, d[i + 1]!, d[i + 2]!, d[i + 3]!)) {
      d[i + 3] = 0;
    }
  }
  tctx.putImageData(data, 0, 0);
  dest.drawImage(tmp, dx, dy);
}

function bakeTown(sheet: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * 2;
  c.height = TILE_SIZE * 2;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  // Cluster of houses forming one 2×2 town marker
  // Top row: roofs / upper walls
  stampKeyed(ctx, sheet, { tx: 7, ty: 26 }, 0, 0);
  stampKeyed(ctx, sheet, { tx: 5, ty: 26 }, 16, 0);
  // Bottom row: doors / entrances
  stampKeyed(ctx, sheet, { tx: 7, ty: 27 }, 0, 16);
  stampKeyed(ctx, sheet, { tx: 5, ty: 27 }, 16, 16);
  // Well / sign accent between buildings
  stampKeyed(ctx, sheet, { tx: 4, ty: 30 }, 10, 18);
  return c;
}

function bakeCastle(sheet: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * 2;
  c.height = TILE_SIZE * 2;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  // Cohesive 2×2 castle keep from atlas
  stampKeyed(ctx, sheet, { tx: 12, ty: 26 }, 0, 0);
  stampKeyed(ctx, sheet, { tx: 13, ty: 26 }, 16, 0);
  stampKeyed(ctx, sheet, { tx: 12, ty: 27 }, 0, 16);
  stampKeyed(ctx, sheet, { tx: 13, ty: 27 }, 16, 16);
  return c;
}

function bakeCave(sheet: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * 2;
  c.height = TILE_SIZE * 2;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  // Rocky mound using cave/rock atlas pieces, keyed onto grass
  stampKeyed(ctx, sheet, { tx: 19, ty: 4 }, 0, 0);
  stampKeyed(ctx, sheet, { tx: 20, ty: 4 }, 16, 0);
  stampKeyed(ctx, sheet, { tx: 19, ty: 5 }, 0, 16);
  stampKeyed(ctx, sheet, { tx: 20, ty: 5 }, 16, 16);

  // Enlarge the dark entrance across the bottom-center so it reads as enterable
  ctx.fillStyle = '#0a0a12';
  ctx.fillRect(10, 18, 12, 10);
  ctx.fillStyle = '#1a1810';
  ctx.fillRect(9, 17, 14, 2);
  // Timber frame
  ctx.fillStyle = '#6a4a28';
  ctx.fillRect(9, 17, 2, 12);
  ctx.fillRect(21, 17, 2, 12);
  ctx.fillRect(9, 17, 14, 2);
  ctx.fillStyle = '#8a6a40';
  ctx.fillRect(10, 18, 1, 10);
  ctx.fillRect(21, 18, 1, 10);

  return c;
}

export type LandmarkSprites = {
  town: HTMLCanvasElement;
  castle: HTMLCanvasElement;
  cave: HTMLCanvasElement;
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
  dx: number,
  dy: number,
): void {
  ctx.drawImage(sprites[kind], dx, dy);
}
