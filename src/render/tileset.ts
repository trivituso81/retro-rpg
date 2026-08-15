/**
 * ArMM1998 Zelda-like overworld atlas (CC0).
 *
 * Base terrain is drawn flat; forests / mountains / landmarks are tall
 * overlays that participate in Y-sorting with the player.
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
  /** Pre-baked 16×32 tree overlays (variant count). */
  trees: HTMLCanvasElement;
  ready: boolean;
  tick(nowMs: number): void;
  drawBase(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
    tileX: number,
    tileY: number,
    map: WorldMap,
  ): void;
  /** Tall overlay for this tile, if any. Anchor = tile top-left; may draw above. */
  drawOverlay(
    ctx: CanvasRenderingContext2D,
    tileId: TileIdValue,
    dx: number,
    dy: number,
    tileX: number,
    tileY: number,
  ): void;
};

type Src = { tx: number; ty: number };

const GRASS: Src[] = [
  { tx: 0, ty: 0 },
  { tx: 0, ty: 3 },
  { tx: 1, ty: 3 },
  { tx: 2, ty: 3 },
];

/** Animated water — four frames across cols 16–19, row 0. */
const OCEAN: Src[] = [
  { tx: 16, ty: 0 },
  { tx: 17, ty: 0 },
  { tx: 18, ty: 0 },
  { tx: 19, ty: 0 },
];

const SHALLOW: Src[] = [
  { tx: 1, ty: 1 },
  { tx: 2, ty: 1 },
  { tx: 1, ty: 2 },
  { tx: 2, ty: 2 },
];

/** Bush / canopy tops for tree bake. */
const BUSH: Src[] = [
  { tx: 0, ty: 6 },
  { tx: 1, ty: 6 },
  { tx: 0, ty: 7 },
  { tx: 1, ty: 7 },
];

/** Small white flower accents. */
const FLOWERS: Src[] = [
  { tx: 2, ty: 12 },
  { tx: 3, ty: 12 },
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

/** Recolor grass → dirt path fill (atlas lacks a clean solid dirt center). */
function bakeDirt(sheet: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE * 4;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = false;
  for (let v = 0; v < 4; v++) {
    const src = GRASS[v]!;
    ctx.clearRect(v * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
    blit(ctx, sheet, src, v * TILE_SIZE, 0);
    const img = ctx.getImageData(v * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i]!;
      const g = d[i + 1]!;
      const b = d[i + 2]!;
      const a = d[i + 3]!;
      if (a < 10) continue;
      // Push greens toward warm dirt
      const nr = Math.min(255, Math.floor(r * 0.55 + g * 0.35 + 28));
      const ng = Math.min(255, Math.floor(g * 0.4 + 36));
      const nb = Math.min(255, Math.floor(b * 0.25 + 18));
      d[i] = nr;
      d[i + 1] = ng;
      d[i + 2] = nb;
    }
    ctx.putImageData(img, v * TILE_SIZE, 0);
  }
  return canvas;
}

/** Peaked mountain silhouettes (transparent) — FF-style range icons. */
function bakeMountains(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE * 8;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const COL = {
    dark: '#5a5048',
    mid: '#7a7068',
    light: '#9a9088',
    hilite: '#b8b0a8',
    outline: '#2a2420',
    snow: '#eef2f6',
    snowShade: '#c8d0dc',
  };

  for (let v = 0; v < 8; v++) {
    const x0 = v * TILE_SIZE;
    const snow = v >= 4;
    const peakX = 7 + (v % 4) - 1;
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
          if (edge) c = COL.outline;
          ctx.fillStyle = c;
          ctx.fillRect(x0 + x, y, 1, 1);
        }
      }
    };

    drawPeak(shoulderX, shoulderY, 5);
    drawPeak(peakX, peakY, 8);
    if (snow) {
      for (let y = peakY; y <= peakY + 4; y++) {
        const half = y - peakY;
        for (let x = peakX - half; x <= peakX + half; x++) {
          if (x < 0 || x >= TILE_SIZE) continue;
          const edge = x === peakX - half || x === peakX + half;
          ctx.fillStyle = edge || y > peakY + 1 ? COL.snowShade : COL.snow;
          ctx.fillRect(x0 + x, y, 1, 1);
        }
      }
    }
  }
  return canvas;
}

/** Bake several 16×32 trees (canopy + trunk) for forest overlays. */
function bakeTrees(sheet: HTMLImageElement): HTMLCanvasElement {
  const count = 4;
  const canvas = document.createElement('canvas');
  canvas.width = TILE_SIZE * count;
  canvas.height = TILE_SIZE * 2;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('tree bake failed');
  ctx.imageSmoothingEnabled = false;

  for (let v = 0; v < count; v++) {
    const x0 = v * TILE_SIZE;
    blit(ctx, sheet, BUSH[v]!, x0, 0);
    ctx.fillStyle = '#3a2818';
    ctx.fillRect(x0 + 6, 18, 4, 12);
    ctx.fillStyle = '#5a4030';
    ctx.fillRect(x0 + 7, 18, 2, 11);
    ctx.fillStyle = '#2a2018';
    ctx.fillRect(x0 + 4, 28, 8, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x0 + 3, 29, 10, 2);
  }

  return canvas;
}

export function createTileset(): Promise<Tileset> {
  const image = new Image();
  image.decoding = 'async';

  let oceanFrame = 0;
  let ready = false;
  let landmarkSprites: LandmarkSprites | null = null;
  let trees: HTMLCanvasElement | null = null;
  let dirt: HTMLCanvasElement | null = null;
  let mountains: HTMLCanvasElement | null = null;

  const tileset: Tileset = {
    image,
    get landmarks() {
      if (!landmarkSprites) throw new Error('landmarks not ready');
      return landmarkSprites;
    },
    get trees() {
      if (!trees) throw new Error('trees not ready');
      return trees;
    },
    get ready() {
      return ready;
    },
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % OCEAN.length;
    },
    drawBase(ctx, tileId, dx, dy, tileX, tileY, _map) {
      if (!ready || !dirt) return;
      const v = variant(tileX, tileY, 4);

      switch (tileId) {
        case TileId.Grass:
        case TileId.TallGrass:
        case TileId.Forest:
        case TileId.Mountain:
        case TileId.Peak:
        case TileId.Town:
        case TileId.Castle:
        case TileId.Cave:
          blit(ctx, image, GRASS[v]!, dx, dy);
          break;

        case TileId.Ocean:
          blit(ctx, image, OCEAN[oceanFrame]!, dx, dy);
          break;

        case TileId.Shallow:
          blit(ctx, image, SHALLOW[v]!, dx, dy);
          break;

        case TileId.Beach:
        case TileId.Road:
          ctx.drawImage(dirt, v * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
          break;

        case TileId.Bridge:
          blit(ctx, image, OCEAN[oceanFrame]!, dx, dy);
          // Simple plank bridge
          ctx.fillStyle = '#6a4a30';
          ctx.fillRect(dx + 2, dy + 3, 12, 10);
          ctx.fillStyle = '#8a6a48';
          ctx.fillRect(dx + 2, dy + 4, 12, 1);
          ctx.fillRect(dx + 2, dy + 7, 12, 1);
          ctx.fillRect(dx + 2, dy + 10, 12, 1);
          ctx.fillStyle = '#4a3020';
          ctx.fillRect(dx + 1, dy + 3, 1, 10);
          ctx.fillRect(dx + 14, dy + 3, 1, 10);
          break;
      }
    },
    drawOverlay(ctx, tileId, dx, dy, tileX, tileY) {
      if (!ready || !trees || !mountains) return;
      const v = variant(tileX, tileY, 4);

      if (tileId === TileId.TallGrass) {
        if (variant(tileX, tileY, 3) === 0) {
          blit(ctx, image, FLOWERS[variant(tileX, tileY, FLOWERS.length)]!, dx, dy);
        } else if (variant(tileX, tileY, 5) === 0) {
          blit(ctx, image, BUSH[variant(tileX, tileY, BUSH.length)]!, dx, dy);
        }
        return;
      }

      if (tileId === TileId.Forest) {
        const tv = variant(tileX, tileY, 4);
        ctx.drawImage(
          trees,
          tv * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE * 2,
          dx,
          dy - TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE * 2,
        );
        return;
      }

      if (tileId === TileId.Mountain) {
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
        return;
      }

      if (tileId === TileId.Peak) {
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
        return;
      }
    },
  };

  return new Promise((resolve, reject) => {
    image.onload = () => {
      trees = bakeTrees(image);
      dirt = bakeDirt(image);
      mountains = bakeMountains();
      landmarkSprites = bakeLandmarks(image);
      ready = true;
      resolve(tileset);
    };
    image.onerror = () =>
      reject(new Error(`Failed to load tileset ${TILESET_URL}`));
    image.src = TILESET_URL;
  });
}
