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
import type { WorldMap } from '../world/map';

export type Tileset = {
  image: HTMLImageElement;
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

const HOUSE: Src = { tx: 7, ty: 27 };
const CASTLE: Src = { tx: 12, ty: 26 };

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
 * Bake opaque mountain / peak tiles (Puny World has cliff *autotiles*,
 * not solid mountain fills — those fragments caused the black columns).
 */
function bakeMountains(_sheet: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE * 8;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('mountain bake failed');
  ctx.imageSmoothingEnabled = false;

  for (let v = 0; v < 4; v++) {
    const x0 = v * TILE_SIZE;
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const shade = x * 0.7 + y * 0.4 + ((x * 3 + y * 5 + v * 17) % 5);
        let c = '#5a6070';
        if (shade < 10) c = '#7a8494';
        if (shade < 5) c = '#9aa3b0';
        if (((x + y * 3 + v) % 11) === 0) c = '#3a3f4a';
        ctx.fillStyle = c;
        ctx.fillRect(x0 + x, y, 1, 1);
      }
    }
    // Ridge
    ctx.fillStyle = '#b8c0cc';
    for (let x = 0; x < TILE_SIZE; x++) {
      const ry = 3 + ((x + v * 2) % 4);
      ctx.fillRect(x0 + x, ry, 1, 1);
    }
  }

  for (let v = 0; v < 4; v++) {
    const x0 = (4 + v) * TILE_SIZE;
    ctx.drawImage(canvas, (v % 4) * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, x0, 0, TILE_SIZE, TILE_SIZE);
    for (let y = 0; y < 6; y++) {
      const half = 2 + y;
      for (let x = 8 - half; x <= 7 + half; x++) {
        ctx.fillStyle = y < 2 ? '#f0f4f8' : '#d0d8e0';
        ctx.fillRect(x0 + x, y, 1, 1);
      }
    }
  }

  return canvas;
}

export function createTileset(): Promise<Tileset> {
  const image = new Image();
  image.decoding = 'async';

  let oceanFrame = 0;
  let ready = false;
  let mountains: HTMLCanvasElement | null = null;

  const tileset: Tileset = {
    image,
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
          break;

        case TileId.TallGrass: {
          blit(ctx, image, GRASS[v]!, dx, dy);
          // Sparse bushes — not every tile, or it reads as forest.
          if (variant(tileX, tileY, 3) === 0) {
            blit(ctx, image, TREES[variant(tileX, tileY, TREES.length)]!, dx, dy);
          }
          break;
        }

        case TileId.Forest: {
          blit(ctx, image, GRASS[v]!, dx, dy);
          blit(ctx, image, TREES[variant(tileX, tileY, TREES.length)]!, dx, dy);
          if (variant(tileX + 2, tileY, 2) === 0) {
            blit(ctx, image, TREES[variant(tileX + 7, tileY, TREES.length)]!, dx, dy);
          }
          break;
        }

        case TileId.Mountain:
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
          // Soft wave highlights so flat fills don't look like a void.
          ctx.fillStyle = oceanFrame === 0 ? '#5ec4d4' : '#4aa8c0';
          const wy = 5 + ((tileX + tileY + oceanFrame) % 3);
          for (let x = 1; x < 15; x += 2) {
            ctx.fillRect(dx + x, dy + wy + (x % 4 === 1 ? 1 : 0), 2, 1);
          }
          break;
        }

        case TileId.Shallow:
          blit(ctx, image, SHALLOW[v]!, dx, dy);
          break;

        case TileId.Beach:
          blit(ctx, image, DIRT[v]!, dx, dy);
          break;

        case TileId.Road:
          blit(ctx, image, DIRT[v]!, dx, dy);
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
          blit(ctx, image, GRASS[v]!, dx, dy);
          blit(ctx, image, HOUSE, dx, dy);
          break;

        case TileId.Castle:
          blit(ctx, image, GRASS[v]!, dx, dy);
          blit(ctx, image, CASTLE, dx, dy);
          break;
      }
    },
  };

  return new Promise((resolve, reject) => {
    image.onload = () => {
      mountains = bakeMountains(image);
      ready = true;
      resolve(tileset);
    };
    image.onerror = () =>
      reject(new Error(`Failed to load tileset ${TILESET_URL}`));
    image.src = TILESET_URL;
  });
}
