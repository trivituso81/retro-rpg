/**
 * Village houses / props — each Puny World "building" atlas cell is already
 * a complete mini structure, so we stamp one cell and scale it up to sit
 * beside Tom's larger sprite.
 */

import { TILE_SIZE } from '../config';

export type BuildingKind = 'houseA' | 'houseB' | 'houseC' | 'inn' | 'well' | 'sign';

export type Building = {
  kind: BuildingKind;
  /** Northwest tile of collision footprint. */
  x: number;
  y: number;
  w: number;
  h: number;
  doorX: number;
  doorY: number;
  label: string;
};

/** Static layout for Tom's Village. Footprints are 2×2 (houses) or 1×1. */
export const VILLAGE_BUILDINGS: readonly Building[] = [
  {
    kind: 'houseA',
    x: 5,
    y: 5,
    w: 2,
    h: 2,
    doorX: 5,
    doorY: 7,
    label: "Myrtle's Cottage",
  },
  {
    kind: 'houseB',
    x: 30,
    y: 5,
    w: 2,
    h: 2,
    doorX: 30,
    doorY: 7,
    label: 'Greg the "Blacksmith"',
  },
  {
    kind: 'inn',
    x: 17,
    y: 4,
    w: 3,
    h: 2,
    doorX: 18,
    doorY: 6,
    label: 'The Commit Inn',
  },
  {
    kind: 'houseC',
    x: 5,
    y: 17,
    w: 2,
    h: 2,
    doorX: 5,
    doorY: 19,
    label: "Pixel's Pad",
  },
  {
    kind: 'houseA',
    x: 30,
    y: 17,
    w: 2,
    h: 2,
    doorX: 31,
    doorY: 19,
    label: "Mayor Quill's Manor",
  },
  {
    kind: 'well',
    x: 19,
    y: 13,
    w: 1,
    h: 1,
    doorX: 19,
    doorY: 14,
    label: 'Wishing Well',
  },
  {
    kind: 'sign',
    x: 12,
    y: 11,
    w: 1,
    h: 1,
    doorX: 12,
    doorY: 12,
    label: 'Welcome Sign',
  },
  {
    kind: 'sign',
    x: 25,
    y: 11,
    w: 1,
    h: 1,
    doorX: 25,
    doorY: 12,
    label: 'Notice Board',
  },
];

type Src = { tx: number; ty: number };

const HOUSE_SRC: Record<BuildingKind, Src> = {
  houseA: { tx: 5, ty: 26 },
  houseB: { tx: 7, ty: 26 },
  houseC: { tx: 3, ty: 26 },
  inn: { tx: 9, ty: 26 },
  well: { tx: 4, ty: 30 },
  sign: { tx: 1, ty: 30 },
};

function isKeyedOut(r: number, g: number, b: number, a: number): boolean {
  if (a < 20) return true;
  if (r + g + b < 40) return true;
  if (g > r + 15 && g > b + 15 && g > 90 && g < 200 && r < 160 && b < 120) {
    return true;
  }
  return false;
}

function extractKeyed(
  sheet: HTMLImageElement,
  src: Src,
): HTMLCanvasElement {
  const tmp = document.createElement('canvas');
  tmp.width = TILE_SIZE;
  tmp.height = TILE_SIZE;
  const tctx = tmp.getContext('2d', { willReadFrequently: true })!;
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
  return tmp;
}

/** Scale a keyed tile to fill the building footprint (nearest-neighbor). */
function bakeScaled(
  sheet: HTMLImageElement,
  kind: BuildingKind,
  tilesW: number,
  tilesH: number,
): HTMLCanvasElement {
  const src = extractKeyed(sheet, HOUSE_SRC[kind]);
  const c = document.createElement('canvas');
  c.width = TILE_SIZE * tilesW;
  c.height = TILE_SIZE * tilesH;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

export type BuildingSprites = Record<BuildingKind, HTMLCanvasElement>;

export function bakeBuildingSprites(sheet: HTMLImageElement): BuildingSprites {
  return {
    houseA: bakeScaled(sheet, 'houseA', 2, 2),
    houseB: bakeScaled(sheet, 'houseB', 2, 2),
    houseC: bakeScaled(sheet, 'houseC', 2, 2),
    inn: bakeScaled(sheet, 'inn', 3, 2),
    well: bakeScaled(sheet, 'well', 1, 1),
    sign: bakeScaled(sheet, 'sign', 1, 1),
  };
}

export function blocksTile(
  buildings: readonly Building[],
  x: number,
  y: number,
): boolean {
  for (const b of buildings) {
    if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
      return true;
    }
  }
  return false;
}

export function findBuildingInteract(
  buildings: readonly Building[],
  x: number,
  y: number,
): Building | null {
  for (const b of buildings) {
    if (x === b.doorX && y === b.doorY) return b;
    if (x >= b.x && x < b.x + b.w && y === b.y + b.h) return b;
  }
  return null;
}
