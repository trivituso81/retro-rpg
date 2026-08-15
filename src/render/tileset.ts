/**
 * Real-art tileset loader (CC0 Puny World by Shade).
 *
 * Swap point: change `TILESET_URL` / the `SRC` table below to point at another
 * atlas. If replacing with real art, use CC0 assets (Kenney, OpenGameArt,
 * itch.io free tilesets). Do not use ripped Nintendo or Square Enix sprites.
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

/** Atlas cell → source. Multiple entries = variants. */
const BASE: Record<TileIdValue, Src[]> = {
  [TileId.Grass]: [
    { tx: 0, ty: 0 },
    { tx: 1, ty: 0 },
    { tx: 2, ty: 0 },
    { tx: 0, ty: 2 },
  ],
  [TileId.TallGrass]: [
    { tx: 0, ty: 0 },
    { tx: 1, ty: 0 },
    { tx: 2, ty: 0 },
    { tx: 0, ty: 2 },
  ],
  // Forest base is grass; tree overlay applied in drawTile.
  [TileId.Forest]: [
    { tx: 0, ty: 0 },
    { tx: 1, ty: 0 },
    { tx: 2, ty: 0 },
  ],
  [TileId.Mountain]: [
    { tx: 12, ty: 5 },
    { tx: 1, ty: 5 },
    { tx: 0, ty: 5 },
    { tx: 14, ty: 5 },
  ],
  [TileId.Peak]: [
    { tx: 14, ty: 4 },
    { tx: 15, ty: 4 },
    { tx: 12, ty: 5 },
    { tx: 14, ty: 5 },
  ],
  [TileId.Ocean]: [
    { tx: 18, ty: 11 },
    { tx: 19, ty: 11 },
    { tx: 20, ty: 11 },
    { tx: 21, ty: 11 },
  ],
  [TileId.Shallow]: [
    { tx: 5, ty: 11 },
    { tx: 5, ty: 12 },
    { tx: 16, ty: 11 },
    { tx: 17, ty: 11 },
  ],
  [TileId.Beach]: [
    { tx: 8, ty: 10 },
    { tx: 9, ty: 10 },
    { tx: 10, ty: 10 },
    { tx: 11, ty: 11 },
  ],
  [TileId.Road]: [
    { tx: 4, ty: 1 },
    { tx: 5, ty: 1 },
    { tx: 6, ty: 1 },
    { tx: 9, ty: 1 },
  ],
  [TileId.Bridge]: [{ tx: 19, ty: 4 }],
  [TileId.Town]: [{ tx: 1, ty: 0 }], // grass under house overlay
  [TileId.Castle]: [{ tx: 1, ty: 0 }],
};

/** Tree overlays for forest (drawn with alpha on top of grass). */
const TREES: Src[] = [
  { tx: 8, ty: 8 },
  { tx: 8, ty: 7 },
  { tx: 8, ty: 9 },
  { tx: 17, ty: 7 },
  { tx: 17, ty: 8 },
  { tx: 1, ty: 8 },
  { tx: 4, ty: 8 },
  { tx: 2, ty: 7 },
];

/** Dense forest fill tiles (full 16×16 tree canopy clusters). */
const FOREST_FILL: Src[] = [
  { tx: 1, ty: 7 },
  { tx: 2, ty: 7 },
  { tx: 4, ty: 7 },
  { tx: 5, ty: 7 },
  { tx: 10, ty: 7 },
  { tx: 11, ty: 7 },
  { tx: 13, ty: 7 },
  { tx: 14, ty: 7 },
];

const HOUSE: Src = { tx: 7, ty: 27 };
const CASTLE: Src = { tx: 12, ty: 26 };
const BRIDGE_PLANK: Src = { tx: 4, ty: 1 };
const OCEAN_FRAMES: Src[][] = [
  [
    { tx: 18, ty: 11 },
    { tx: 19, ty: 11 },
    { tx: 20, ty: 11 },
    { tx: 21, ty: 11 },
  ],
  [
    { tx: 18, ty: 13 },
    { tx: 19, ty: 13 },
    { tx: 20, ty: 13 },
    { tx: 21, ty: 13 },
  ],
];

/** Shoreline tiles when ocean sits next to land (N,E,S,W bit flags). */
const OCEAN_SHORE: Record<number, Src> = {
  // bits: N=1 E=2 S=4 W=8 — land on that side
  1: { tx: 15, ty: 10 },
  2: { tx: 16, ty: 11 },
  4: { tx: 15, ty: 12 },
  8: { tx: 14, ty: 11 },
  3: { tx: 16, ty: 10 },
  6: { tx: 16, ty: 12 },
  12: { tx: 14, ty: 12 },
  9: { tx: 14, ty: 10 },
};

function isLand(id: TileIdValue): boolean {
  return (
    id === TileId.Grass ||
    id === TileId.TallGrass ||
    id === TileId.Forest ||
    id === TileId.Mountain ||
    id === TileId.Peak ||
    id === TileId.Beach ||
    id === TileId.Road ||
    id === TileId.Bridge ||
    id === TileId.Town ||
    id === TileId.Castle
  );
}

function variantIndex(tileX: number, tileY: number, mod: number): number {
  return Math.abs(tileX * 3 + tileY * 5) % mod;
}

function blit(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
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

function landMask(map: WorldMap, x: number, y: number): number {
  let m = 0;
  if (map.inBounds(x, y - 1) && isLand(map.getTile(x, y - 1))) m |= 1;
  if (map.inBounds(x + 1, y) && isLand(map.getTile(x + 1, y))) m |= 2;
  if (map.inBounds(x, y + 1) && isLand(map.getTile(x, y + 1))) m |= 4;
  if (map.inBounds(x - 1, y) && isLand(map.getTile(x - 1, y))) m |= 8;
  return m;
}

/**
 * Load the atlas. Resolves when the image is ready to draw.
 * Until then `ready` is false and drawTile no-ops.
 */
export function createTileset(): Promise<Tileset> {
  const image = new Image();
  image.decoding = 'async';

  let oceanFrame = 0;
  let ready = false;

  const tileset: Tileset = {
    image,
    get ready() {
      return ready;
    },
    tick(nowMs: number) {
      oceanFrame = Math.floor(nowMs / OCEAN_FRAME_MS) % 2;
    },
    drawTile(ctx, tileId, dx, dy, tileX, tileY, map) {
      if (!ready) return;

      if (tileId === TileId.Bridge) {
        const water = OCEAN_FRAMES[oceanFrame]![variantIndex(tileX, tileY, 4)]!;
        blit(ctx, image, water, dx, dy);
        blit(ctx, image, BRIDGE_PLANK, dx, dy);
        return;
      }

      if (tileId === TileId.Ocean) {
        const mask = landMask(map, tileX, tileY);
        const shore = OCEAN_SHORE[mask];
        if (shore) {
          blit(ctx, image, shore, dx, dy);
        } else {
          const frames = OCEAN_FRAMES[oceanFrame]!;
          const src = frames[variantIndex(tileX, tileY, frames.length)]!;
          blit(ctx, image, src, dx, dy);
        }
        return;
      }

      if (tileId === TileId.Forest) {
        // Grass underlay so transparent canopy pixels don't show as black voids.
        const grass = BASE[TileId.Grass][variantIndex(tileX, tileY, 4)]!;
        blit(ctx, image, grass, dx, dy);
        const fill = FOREST_FILL[variantIndex(tileX, tileY, FOREST_FILL.length)]!;
        blit(ctx, image, fill, dx, dy);
        if (variantIndex(tileX, tileY, 5) === 0) {
          const tree = TREES[variantIndex(tileX + 1, tileY, TREES.length)]!;
          blit(ctx, image, tree, dx, dy);
        }
        return;
      }

      if (tileId === TileId.TallGrass) {
        const grass = BASE[TileId.Grass][variantIndex(tileX, tileY, 4)]!;
        blit(ctx, image, grass, dx, dy);
        // Scatter bush/crop accents for denser reading.
        const bush = TREES[variantIndex(tileX, tileY, 3)]!;
        if (variantIndex(tileX, tileY, 2) === 0) {
          blit(ctx, image, bush, dx, dy);
        }
        return;
      }

      if (tileId === TileId.Mountain || tileId === TileId.Peak) {
        // Solid rock underlay, then detail tile (some cliff tiles are partial).
        blit(ctx, image, { tx: 12, ty: 5 }, dx, dy);
        const list = BASE[tileId];
        const src = list[variantIndex(tileX, tileY, list.length)]!;
        blit(ctx, image, src, dx, dy);
        return;
      }

      const list = BASE[tileId];
      const src = list[variantIndex(tileX, tileY, list.length)]!;
      blit(ctx, image, src, dx, dy);

      if (tileId === TileId.Town) {
        blit(ctx, image, HOUSE, dx, dy);
      } else if (tileId === TileId.Castle) {
        blit(ctx, image, CASTLE, dx, dy);
      }
    },
  };

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ready = true;
      resolve(tileset);
    };
    image.onerror = () => reject(new Error(`Failed to load tileset ${TILESET_URL}`));
    image.src = TILESET_URL;
  });
}
