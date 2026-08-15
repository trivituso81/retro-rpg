/**
 * Procedural tile atlas generation (32×32 tiles).
 *
 * Swap point: replace `createTileset()` with a loader that draws a real
 * `tileset.png` into the same atlas layout. If replacing with real art,
 * use CC0 assets (Kenney, OpenGameArt, itch.io free tilesets).
 * Do not use ripped Nintendo or Square Enix sprites.
 */

import {
  OCEAN_FRAME_MS,
  PALETTE,
  TILE_SIZE,
  TileId,
  type TileIdValue,
} from '../config';

export type Tileset = {
  atlas: HTMLCanvasElement;
  oceanFrames: number;
  tick(nowMs: number): void;
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
    tileX?: number,
    tileY?: number,
  ): void;
};

const VARIANTS = 4;
const ATLAS_COLS = 4;
const ATLAS_ROWS = 11;

function hex(i: number): string {
  return PALETTE[i] ?? PALETTE[0];
}

function dither(seed: number, x: number, y: number): number {
  let n = (seed * 374761393 + x * 668265263 + y * 2147483647) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n >>> 0) % 1000) / 1000;
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
): void {
  if (x < 0 || y < 0 || x >= TILE_SIZE || y >= TILE_SIZE) return;
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, 1, 1);
}

function fill(
  ctx: CanvasRenderingContext2D,
  color: number,
  x = 0,
  y = 0,
  w = TILE_SIZE,
  h = TILE_SIZE,
): void {
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, w, h);
}

function blade(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
  h = 3,
): void {
  for (let i = 0; i < h; i++) px(ctx, x, y - i, color);
}

function drawGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const band = y < 8 ? 11 : y > 22 ? 9 : 10;
      const d = dither(seed, x, y);
      let c = band;
      if (d < 0.08) c = 9;
      else if (d > 0.92) c = 11;
      // Soft mottling
      if (((x * 3 + y * 5 + seed) & 7) === 0 && d > 0.4) c = 9;
      px(ctx, x, y, c);
    }
  }
  const ox = seed % 5;
  const tufts: Array<[number, number, number]> = [
    [3 + ox, 6, 3],
    [10, 5, 4],
    [18, 7, 3],
    [25 - (ox % 3), 6, 3],
    [5, 14, 4],
    [14, 13, 3],
    [22, 15, 4],
    [8, 21, 3],
    [16, 22, 5],
    [27, 20, 3],
    [4, 27, 3],
    [12, 28, 4],
    [20, 26, 3],
    [28, 28, 3],
  ];
  for (const [tx, ty, h] of tufts) {
    blade(ctx, tx, ty, 9, h);
    if (dither(seed, tx, ty) > 0.45) blade(ctx, tx + 1, ty, 12, h - 1);
  }
  if (seed % 4 === 1) {
    px(ctx, 9, 11, 20);
    px(ctx, 10, 11, 18);
  }
  if (seed % 4 === 3) {
    px(ctx, 21, 18, 20);
    px(ctx, 6, 24, 5);
  }
}

function drawTallGrass(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      let c = d < 0.5 ? 9 : 12;
      if (((x + y + seed) % 3) === 0) c = 13;
      px(ctx, x, y, c);
    }
  }
  for (let i = 0; i < 18; i++) {
    const x = (i * 5 + seed * 2) % 30;
    for (let y = 4; y < 30; y++) {
      if ((y + i) % 2 === 0) px(ctx, x, y, 12);
      if ((y + i) % 5 === 0) px(ctx, x + 1, y, 9);
      if ((y + i * 2) % 7 === 0) px(ctx, x, y, 13);
    }
  }
}

function canopyBlob(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  seed: number,
): void {
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist2 = dx * dx + dy * dy;
      if (dist2 > r * r) continue;
      const edge = dist2 > (r - 1.5) * (r - 1.5);
      const d = dither(seed, x, y);
      let c = 12;
      if (edge) c = 13;
      else if (d < 0.22) c = 13;
      else if (d > 0.84) c = 9;
      else if (dy < -r * 0.25 && d > 0.45) c = 10;
      px(ctx, x, y, c);
    }
  }
}

function drawForest(ctx: CanvasRenderingContext2D, seed: number): void {
  fill(ctx, 13);
  for (let y = 20; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      px(ctx, x, y, dither(seed, x, y) < 0.45 ? 12 : 9);
    }
  }
  const s = seed % 4;
  canopyBlob(ctx, 8 + s, 9, 8, seed);
  canopyBlob(ctx, 22 - s, 8, 8, seed + 3);
  canopyBlob(ctx, 15, 16, 10, seed + 7);
  canopyBlob(ctx, 6, 20, 6, seed + 11);
  canopyBlob(ctx, 25, 22, 6, seed + 13);
  canopyBlob(ctx, 16, 26, 5, seed + 17);
  // Trunks with bark notches
  fill(ctx, 21, 14, 20, 4, 10);
  fill(ctx, 0, 14, 20, 1, 10);
  px(ctx, 15, 23, 14);
  px(ctx, 16, 26, 14);
  fill(ctx, 21, 6 + s, 22, 2, 6);
  fill(ctx, 21, 24 - s, 23, 2, 5);
}

function drawMountain(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      // Diagonal light — no regular vertical cracks (those read as fences)
      const shade = x * 0.7 + y * 0.45 + Math.sin((x + seed) * 0.4) * 2;
      let c = 6;
      if (shade < 14) c = 7;
      if (shade < 8) c = 8;
      if (shade < 4) c = 5;
      const d = dither(seed, x, y);
      if (d < 0.05) c = 0;
      else if (d > 0.95) c = 21;
      px(ctx, x, y, c);
    }
  }
  // Jagged ridgeline unique per variant
  let ry = 5 + (seed % 3);
  for (let x = 0; x < TILE_SIZE; x++) {
    ry += dither(seed, x, 0) > 0.6 ? 1 : dither(seed, x, 1) < 0.35 ? -1 : 0;
    ry = Math.max(3, Math.min(10, ry));
    px(ctx, x, ry, 8);
    px(ctx, x, ry + 1, 7);
    if (x % 3 === seed % 3) px(ctx, x, ry - 1, 5);
  }
  // Sparse irregular fissures (not a grid)
  const fissures = [
    [6 + (seed % 3), 14, 5],
    [18, 16 + (seed % 2), 4],
    [12, 22, 3],
    [24 - (seed % 4), 20, 5],
  ] as const;
  for (const [fx, fy, len] of fissures) {
    for (let i = 0; i < len; i++) {
      px(ctx, fx + (i % 2), fy + i, 0);
      px(ctx, fx + 1 + (i % 2), fy + i, 6);
    }
  }
  // Talus / scree
  for (let x = 2; x < 30; x++) {
    if (dither(seed, x, 28) > 0.35) px(ctx, x, 28, 7);
    if (dither(seed, x, 29) > 0.45) px(ctx, x, 29, 6);
    if (dither(seed, x, 30) > 0.5) px(ctx, x, 30, 7);
  }
}

function drawPeak(ctx: CanvasRenderingContext2D, seed: number): void {
  drawMountain(ctx, seed + 40);
  for (let y = 0; y < 14; y++) {
    const half = 3 + Math.floor(y * 0.9);
    for (let x = 16 - half; x <= 15 + half; x++) {
      const d = dither(seed, x, y);
      const edge = x <= 16 - half + 1 || x >= 15 + half - 1 || y >= 12;
      let c = 23;
      if (edge) c = d < 0.5 ? 8 : 5;
      else if (d < 0.18) c = 5;
      else if (d > 0.88) c = 8;
      px(ctx, x, y, c);
    }
  }
  // Wind cornice
  for (let x = 8; x < 14; x++) px(ctx, x, 3, 5);
  for (let x = 18; x < 24; x++) px(ctx, x, 5, 23);
}

function drawOcean(
  ctx: CanvasRenderingContext2D,
  seed: number,
  frame: 0 | 1,
): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      let c = y > 20 ? 2 : 1;
      const d = dither(seed, x, y);
      if (d < 0.05) c = 0;
      else if (d > 0.95) c = 2;
      px(ctx, x, y, c);
    }
  }
  const y0 = 8 + frame * 3;
  for (let x = 0; x < TILE_SIZE; x++) {
    const bump = Math.sin((x + frame * 5) * 0.45) > 0.2 ? 1 : 0;
    const bump2 = Math.sin((x + frame * 5) * 0.45) > 0.7 ? 1 : 0;
    px(ctx, x, y0 + bump, 3);
    px(ctx, x, y0 + bump + 1, 2);
    if (bump2) px(ctx, x, y0 + bump - 1, 4);
    if ((x + frame * 2) % 5 === 0) px(ctx, x, y0 + bump + 2, 1);
  }
  const y1 = 20 - frame * 2;
  for (let x = 0; x < TILE_SIZE; x++) {
    if ((x + seed + frame) % 2 === 0) {
      const bump = (x + frame * 3) % 4 === 0 ? 1 : 0;
      px(ctx, x, y1 + bump, 2);
      if ((x + frame) % 6 === 0) px(ctx, x, y1 + bump - 1, 3);
    }
  }
  // Foam flecks
  const glints =
    frame === 0
      ? [
          [5, 5],
          [14, 12],
          [26, 7],
          [20, 18],
        ]
      : [
          [9, 6],
          [22, 11],
          [3, 15],
          [28, 20],
        ];
  for (const [gx, gy] of glints) {
    px(ctx, gx, gy, 4);
    px(ctx, gx + 1, gy, 3);
  }
}

function drawShallow(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const d = dither(seed, x, y);
      let c = 4;
      if (d < 0.12) c = 3;
      else if (d > 0.88) c = 5;
      if ((x + y * 2 + seed) % 11 === 0) c = 2;
      px(ctx, x, y, c);
    }
  }
  for (let x = 2; x < 30; x++) {
    px(ctx, x, 7 + ((x + seed) % 4), 5);
    px(ctx, x, 18 + ((x * 2 + seed) % 3), 3);
    px(ctx, x, 26 + ((x + seed * 2) % 2), 5);
  }
}

function drawBeach(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      let c = y > 22 ? 14 : y > 14 ? 15 : y > 6 ? 15 : 16;
      const d = dither(seed, x, y);
      if (d < 0.07) c = 14;
      if (d > 0.93) c = 16;
      // Wet ripple near bottom
      if (y > 24 && (x + y) % 5 === 0) c = 4;
      px(ctx, x, y, c);
    }
  }
  px(ctx, 6 + (seed % 4), 8, 8);
  px(ctx, 20, 12 + (seed % 3), 23);
  px(ctx, 12, 20, 14);
  px(ctx, 25, 18, 8);
}

function drawRoad(ctx: CanvasRenderingContext2D, seed: number): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < 6; x++) {
      px(ctx, x, y, dither(seed, x, y) < 0.5 ? 10 : 9);
      px(ctx, 31 - x, y, dither(seed, 31 - x, y) < 0.5 ? 10 : 9);
    }
  }
  fill(ctx, 14, 6, 0, 20, TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 6; x < 26; x++) {
      const d = dither(seed, x, y);
      if (d < 0.1) px(ctx, x, y, 21);
      else if (d > 0.9) px(ctx, x, y, 15);
    }
  }
  fill(ctx, 15, 12, 0, 8, TILE_SIZE);
  for (let y = 0; y < TILE_SIZE; y += 2) {
    px(ctx, 14, y, 16);
    px(ctx, 17, y + 1, 14);
  }
  // Edge grit
  for (const x of [6, 25]) {
    for (let y = 2; y < 30; y += 4 + (seed % 3)) {
      px(ctx, x, y, 7);
      px(ctx, x + (x < 16 ? 1 : -1), y + 1, 14);
    }
  }
}

function drawBridge(ctx: CanvasRenderingContext2D, _seed: number): void {
  fill(ctx, 2);
  for (let x = 0; x < TILE_SIZE; x++) {
    px(ctx, x, 6, 3);
    px(ctx, x, 7, 4);
    px(ctx, x, 24, 1);
  }
  fill(ctx, 14, 4, 2, 24, 28);
  for (let y = 4; y < 30; y += 4) {
    fill(ctx, 21, 4, y, 24, 1);
    fill(ctx, 15, 4, y + 1, 24, 2);
  }
  fill(ctx, 17, 2, 0, 2, TILE_SIZE);
  fill(ctx, 17, 28, 0, 2, TILE_SIZE);
  for (const y of [4, 12, 20, 28]) {
    fill(ctx, 0, 1, y, 3, 3);
    fill(ctx, 0, 28, y, 3, 3);
  }
}

function drawTown(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed + 90);
  fill(ctx, 14, 10, 26, 12, 6);
  // Building
  fill(ctx, 16, 6, 14, 20, 14);
  fill(ctx, 8, 6, 14, 20, 2);
  fill(ctx, 17, 6, 14, 2, 14);
  fill(ctx, 17, 24, 14, 2, 14);
  fill(ctx, 17, 6, 20, 20, 1);
  // Roof
  for (let i = 0; i < 12; i++) {
    fill(ctx, 18, 15 - i, 3 + i, 2 + i * 2, 1);
    fill(ctx, 17, 15 - i, 4 + i, 2 + i * 2, 1);
  }
  // Door / windows
  fill(ctx, 0, 14, 22, 4, 6);
  fill(ctx, 20, 9, 17, 3, 3);
  fill(ctx, 0, 9, 17, 3, 1);
  fill(ctx, 20, 20, 17, 3, 3);
  fill(ctx, 0, 20, 17, 3, 1);
  // Chimney
  fill(ctx, 17, 22, 4, 4, 6);
  px(ctx, 23, 2, 8);
  px(ctx, 24, 3, 8);
}

function drawCastle(ctx: CanvasRenderingContext2D, seed: number): void {
  drawGrass(ctx, seed + 120);
  fill(ctx, 7, 4, 10, 24, 22);
  fill(ctx, 8, 5, 10, 22, 3);
  fill(ctx, 6, 4, 28, 24, 4);
  // Battlements
  for (let x = 4; x <= 24; x += 4) {
    fill(ctx, 7, x, 5, 3, 5);
    fill(ctx, 8, x, 5, 3, 2);
  }
  // Gate
  fill(ctx, 6, 11, 18, 10, 14);
  fill(ctx, 0, 13, 22, 6, 10);
  px(ctx, 14, 24, 21);
  px(ctx, 17, 24, 21);
  // Towers
  fill(ctx, 7, 2, 8, 5, 16);
  fill(ctx, 7, 25, 8, 5, 16);
  fill(ctx, 18, 2, 6, 5, 3);
  fill(ctx, 18, 25, 6, 5, 3);
  fill(ctx, 22, 14, 1, 3, 7);
  px(ctx, 14, 2, 18);
  px(ctx, 15, 3, 18);
  // Windows
  for (const [wx, wy] of [
    [7, 14],
    [24, 14],
    [7, 20],
    [24, 20],
    [12, 14],
    [19, 14],
  ] as const) {
    fill(ctx, 20, wx, wy, 2, 2);
    fill(ctx, 0, wx, wy, 2, 1);
  }
}

type DrawFn = (ctx: CanvasRenderingContext2D, seed: number) => void;

function slotFor(
  tileId: TileIdValue,
  variant: number,
  oceanFrame = 0,
): { col: number; row: number } {
  const v = variant % VARIANTS;
  switch (tileId) {
    case TileId.Grass:
      return { col: v, row: 0 };
    case TileId.TallGrass:
      return { col: v, row: 1 };
    case TileId.Forest:
      return { col: v, row: 2 };
    case TileId.Mountain:
      return { col: v, row: 3 };
    case TileId.Peak:
      return { col: v, row: 4 };
    case TileId.Ocean:
      return { col: v, row: 5 + oceanFrame };
    case TileId.Shallow:
      return { col: v, row: 7 };
    case TileId.Beach:
      return { col: v, row: 8 };
    case TileId.Road:
      return { col: v, row: 9 };
    case TileId.Bridge:
      return { col: 0, row: 10 };
    case TileId.Town:
      return { col: 1, row: 10 };
    case TileId.Castle:
      return { col: 2, row: 10 };
  }
}

export function createTileset(): Tileset {
  const atlas = document.createElement('canvas');
  atlas.width = ATLAS_COLS * TILE_SIZE;
  atlas.height = ATLAS_ROWS * TILE_SIZE;
  const ctx = atlas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Failed to create tileset atlas context');
  ctx.imageSmoothingEnabled = false;

  const drawers: Partial<Record<TileIdValue, DrawFn>> = {
    [TileId.Grass]: drawGrass,
    [TileId.TallGrass]: drawTallGrass,
    [TileId.Forest]: drawForest,
    [TileId.Mountain]: drawMountain,
    [TileId.Peak]: drawPeak,
    [TileId.Shallow]: drawShallow,
    [TileId.Beach]: drawBeach,
    [TileId.Road]: drawRoad,
    [TileId.Bridge]: drawBridge,
    [TileId.Town]: drawTown,
    [TileId.Castle]: drawCastle,
  };

  for (const [idStr, drawer] of Object.entries(drawers)) {
    const id = Number(idStr) as TileIdValue;
    const variants =
      id === TileId.Bridge || id === TileId.Town || id === TileId.Castle
        ? 1
        : VARIANTS;
    for (let v = 0; v < variants; v++) {
      const { col, row } = slotFor(id, v);
      ctx.save();
      ctx.translate(col * TILE_SIZE, row * TILE_SIZE);
      drawer!(ctx, id * 97 + v * 13 + 5);
      ctx.restore();
    }
  }

  for (let frame = 0 as 0 | 1; frame <= 1; frame = (frame + 1) as 0 | 1) {
    for (let v = 0; v < VARIANTS; v++) {
      const { col, row } = slotFor(TileId.Ocean, v, frame);
      ctx.save();
      ctx.translate(col * TILE_SIZE, row * TILE_SIZE);
      drawOcean(ctx, 505 + v * 17, frame);
      ctx.restore();
    }
  }

  let oceanFrame = 0;

  return {
    atlas,
    oceanFrames: 2,
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % 2;
    },
    drawTile(dest, tileId, dx, dy, tileX = 0, tileY = 0) {
      const variant = (tileX * 3 + tileY * 5) & 3;
      const { col, row } =
        tileId === TileId.Ocean
          ? slotFor(tileId, variant, oceanFrame)
          : slotFor(tileId, variant);
      dest.drawImage(
        atlas,
        col * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        dx,
        dy,
        TILE_SIZE,
        TILE_SIZE,
      );
    },
  };
}
