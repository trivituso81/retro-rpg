/**
 * Real-art tileset loader (CC0 Puny World by Shade).
 *
 * Important: many cells in this atlas are *pond autotile pieces* (circular
 * water blobs). We only sample solid fill tiles + object overlays so the
 * overworld does not look like scattered puddles.
 *
 * Swap point: change `TILESET_URL` / the SRC tables. Use CC0 art only —
 * Kenney, OpenGameArt, itch.io. No ripped Nintendo / Square Enix sprites.
 */

import {
  OCEAN_FRAME_MS,
  TILE_SIZE,
  TILESET_URL,
  TileId,
  type TileIdValue,
} from '../config';
import {
  bakeLandmarks,
  type LandmarkSprites,
} from '../world/landmarks';
import type { WorldMap } from '../world/map';

export type Tileset = {
  image: HTMLImageElement;
  landmarks: LandmarkSprites;
  ready: boolean;
  tick(nowMs: number): void;
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
    tileX: number,
    tileY: number,
    map: WorldMap,
  ): void;
};

type Src = { tx: number; ty: number };

/** Solid fills only — no pond/cliff autotile fragments. */
const GRASS: Src[] = [
  { tx: 0, ty: 0 },
  { tx: 1, ty: 0 },
  { tx: 2, ty: 0 },
  { tx: 0, ty: 2 },
];

/** Continuous dirt (path / beach sand centers). */
const DIRT: Src[] = [
  { tx: 8, ty: 1 },
  { tx: 11, ty: 1 },
  { tx: 20, ty: 1 },
  { tx: 23, ty: 1 },
];

/** Slightly textured deep water animation frames (not pond pieces). */
const OCEAN: Src[][] = [
  [
    { tx: 25, ty: 10 },
    { tx: 26, ty: 10 },
    { tx: 25, ty: 11 },
    { tx: 26, ty: 11 },
  ],
  [
    { tx: 25, ty: 13 },
    { tx: 26, ty: 13 },
    { tx: 25, ty: 14 },
    { tx: 26, ty: 14 },
  ],
];

const SHALLOW: Src[] = [
  { tx: 8, ty: 11 },
  { tx: 8, ty: 14 },
  { tx: 8, ty: 17 },
  { tx: 8, ty: 20 },
];

/** Tree / bush object overlays (transparent). */
const TREES: Src[] = [
  { tx: 8, ty: 8 },
  { tx: 8, ty: 7 },
  { tx: 8, ty: 9 },
  { tx: 17, ty: 7 },
  { tx: 17, ty: 8 },
  { tx: 1, ty: 8 },
  { tx: 4, ty: 8 },
  { tx: 0, ty: 26 },
  { tx: 1, ty: 26 },
  { tx: 2, ty: 26 },
];

function variant(tileX: number, tileY: number, mod: number): number {
  return Math.abs(tileX * 3 + tileY * 5) % mod;
}

function blit(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  src: Src,
  dx: number,
  dy: number,
): void {
  ctx.drawImage(
    image,
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

/**
 * Bake peaked mountain *overlays* (transparent outside the silhouette)
 * so the rest of the tile can show the same grass as plains tiles.
 */
function bakeMountains(_sheet: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // 0–3 mountain, 4–7 peak (snow tip).
  canvas.width = TILE_SIZE * 8;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('mountain bake failed');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const COL = {
    dark: '#4a4558',
    mid: '#6a6578',
    light: '#8a8498',
    hilite: '#a8a0b4',
    outline: '#2a2838',
    snow: '#eef2f6',
    snowShade: '#c8d0dc',
  };

  for (let v = 0; v < 8; v++) {
    const x0 = v * TILE_SIZE;
    const snow = v >= 4;
    const peakX = 7 + (v % 4) - 1; // 6..9
    const peakY = snow ? 1 : 2;
    const shoulderX = peakX + (v % 2 === 0 ? -5 : 5);
    const shoulderY = 6;

    const drawPeak = (px: number, py: number, halfBase: number): void => {
      for (let y = py; y < TILE_SIZE; y++) {
        const t = (y - py) / Math.max(1, TILE_SIZE - 1 - py);
        const half = Math.max(1, Math.floor(halfBase * t));
        for (let x = px - half; x <= px + half; x++) {
          if (x < 0 || x >= TILE_SIZE) continue;
          const onLeft = x < px;
          const edge = x === px - half || x === px + half;
          let c = onLeft ? COL.light : COL.mid;
          if (x === px) c = COL.hilite;
          if (!onLeft && (x + y) % 3 === 0) c = COL.dark;
          if (onLeft && (x * 2 + y) % 5 === 0) c = COL.hilite;
          if (edge) c = COL.outline;
          if (y > 12 && (x + y + v) % 4 === 0) c = COL.dark;
          ctx.fillStyle = c;
          ctx.fillRect(x0 + x, y, 1, 1);
        }
      }
    };

    drawPeak(shoulderX, shoulderY, 5);
    drawPeak(peakX, peakY, 8);

    ctx.fillStyle = COL.outline;
    ctx.fillRect(x0 + peakX, peakY, 1, 1);

    if (snow) {
      for (let y = peakY; y <= peakY + 4; y++) {
        const half = y - peakY;
        for (let x = peakX - half; x <= peakX + half; x++) {
          if (x < 0 || x >= TILE_SIZE) continue;
          const edge = x === peakX - half || x === peakX + half;
          ctx.fillStyle =
            edge || y > peakY + 1 ? COL.snowShade : COL.snow;
          ctx.fillRect(x0 + x, y, 1, 1);
        }
      }
      ctx.fillStyle = COL.snow;
      ctx.fillRect(x0 + peakX, peakY, 1, 1);
    }
  }

  return canvas;
}

/** Deterministic 0..1 noise for subtle terrain grit. */
function grit(seed: number, x: number, y: number): number {
  let n = (seed * 374761393 + x * 668265263 + y * 2147483647) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n >>> 0) % 1000) / 1000;
}

/** Sparse pixel flecks — a touch of texture, not a new pattern. */
function dust(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  seed: number,
  dark: string,
  light: string,
  density = 0.1,
): void {
  for (let y = 0; y < TILE_SIZE; y++) {
    for (let x = 0; x < TILE_SIZE; x++) {
      const g = grit(seed, x, y);
      if (g < density * 0.5) {
        ctx.fillStyle = dark;
        ctx.fillRect(dx + x, dy + y, 1, 1);
      } else if (g > 1 - density * 0.45) {
        ctx.fillStyle = light;
        ctx.fillRect(dx + x, dy + y, 1, 1);
      }
    }
  }
}

export function createTileset(): Promise<Tileset> {
  const image = new Image();
  image.decoding = 'async';

  let oceanFrame = 0;
  let ready = false;
  let mountains: HTMLCanvasElement | null = null;
  let landmarkSprites: LandmarkSprites | null = null;

  const tileset: Tileset = {
    image,
    get landmarks() {
      if (!landmarkSprites) throw new Error('landmarks not ready');
      return landmarkSprites;
    },
    get ready() {
      return ready;
    },
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % 2;
    },
    drawTile(ctx, tileId, dx, dy, tileX, tileY, _map) {
      if (!ready || !mountains) return;
      const v = variant(tileX, tileY, 4);

      switch (tileId) {
        case TileId.Grass:
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#4a6a38', '#9aba58', 0.09);
          break;

        case TileId.TallGrass: {
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#3a5a28', '#8aaa48', 0.14);
          // Sparse bushes — not every tile, or it reads as forest.
          if (variant(tileX, tileY, 3) === 0) {
            blit(ctx, image, TREES[variant(tileX, tileY, TREES.length)]!, dx, dy);
          }
          break;
        }

        case TileId.Forest: {
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#4a6a38', '#9aba58', 0.07);
          blit(ctx, image, TREES[variant(tileX, tileY, TREES.length)]!, dx, dy);
          if (variant(tileX + 2, tileY, 2) === 0) {
            blit(ctx, image, TREES[variant(tileX + 7, tileY, TREES.length)]!, dx, dy);
          }
          break;
        }

        case TileId.Mountain:
          // Same grass base as plains, mountain icon on top — blends at the edges.
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#4a6a38', '#9aba58', 0.09);
          ctx.drawImage(
            mountains,
            v * TILE_SIZE,
            0,
            TILE_SIZE,
            TILE_SIZE,
            dx,
            dy,
            TILE_SIZE,
            TILE_SIZE,
          );
          break;

        case TileId.Peak:
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#4a6a38', '#9aba58', 0.09);
          ctx.drawImage(
            mountains,
            (4 + v) * TILE_SIZE,
            0,
            TILE_SIZE,
            TILE_SIZE,
            dx,
            dy,
            TILE_SIZE,
            TILE_SIZE,
          );
          break;

        case TileId.Ocean: {
          const frame = OCEAN[oceanFrame]!;
          blit(ctx, image, frame[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 9 + tileY * 3 + oceanFrame, '#1a6a88', '#6ec8d8', 0.08);
          // Soft wave highlights
          ctx.fillStyle = oceanFrame === 0 ? '#7ed4e0' : '#5eb8c8';
          const wy = 5 + ((tileX + tileY + oceanFrame) % 3);
          for (let x = 1; x < 15; x += 2) {
            ctx.fillRect(dx + x, dy + wy + (x % 4 === 1 ? 1 : 0), 2, 1);
          }
          const wy2 = 11 - oceanFrame;
          for (let x = 2; x < 14; x += 3) {
            ctx.fillRect(dx + x, dy + wy2, 2, 1);
          }
          break;
        }

        case TileId.Shallow:
          blit(ctx, image, SHALLOW[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 11 + tileY * 5, '#3a98a8', '#a8e8f0', 0.1);
          ctx.fillStyle = '#c0f0f8';
          for (let x = 2; x < 14; x += 4) {
            ctx.fillRect(dx + x, dy + 6 + ((x + tileY) % 3), 2, 1);
          }
          break;

        case TileId.Beach:
          blit(ctx, image, DIRT[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 17 + tileY * 11, '#b09050', '#e8d090', 0.11);
          break;

        case TileId.Road:
          blit(ctx, image, DIRT[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 17 + tileY * 11, '#a08048', '#e0c878', 0.1);
          break;

        case TileId.Bridge: {
          const frame = OCEAN[oceanFrame]!;
          blit(ctx, image, frame[v]!, dx, dy);
          blit(ctx, image, DIRT[0]!, dx, dy);
          // Plank lines
          ctx.fillStyle = '#5a4030';
          ctx.fillRect(dx + 2, dy + 4, 12, 1);
          ctx.fillRect(dx + 2, dy + 8, 12, 1);
          ctx.fillRect(dx + 2, dy + 12, 12, 1);
          break;
        }

        case TileId.Town:
        case TileId.Castle:
        case TileId.Cave:
          // 2×2 landmark sprite is drawn by drawWorld; base is grass.
          blit(ctx, image, GRASS[v]!, dx, dy);
          dust(ctx, dx, dy, tileX * 13 + tileY * 7, '#4a6a38', '#9aba58', 0.09);
          break;
      }
    },
  };

  return new Promise((resolve, reject) => {
    image.onload = () => {
      mountains = bakeMountains(image);
      landmarkSprites = bakeLandmarks(image);
      ready = true;
      resolve(tileset);
    };
    image.onerror = () =>
      reject(new Error(`Failed to load tileset ${TILESET_URL}`));
    image.src = TILESET_URL;
  });
}
