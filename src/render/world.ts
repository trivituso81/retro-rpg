import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  TILE_SIZE,
  TileId,
} from '../config';
import type { Camera } from './camera';
import type { Tileset } from './tileset';
import {
  drawLandmarkSprite,
  isLandmarkCoverage,
  landmarkSortY,
  type Landmark,
} from '../world/landmarks';
import type { WorldMap } from '../world/map';

export type DrawableActor = {
  /** World-pixel feet / sort key. */
  sortY: number;
  draw: () => void;
};

/**
 * Draw base terrain, then Y-sort tall overlays + landmarks + the player
 * so you can walk behind trees and buildings.
 */
export function drawWorld(
  ctx: CanvasRenderingContext2D,
  map: WorldMap,
  tileset: Tileset,
  cam: Camera,
  actors: readonly DrawableActor[] = [],
): void {
  const startTX = Math.floor(cam.x / TILE_SIZE) - 1;
  const startTY = Math.floor(cam.y / TILE_SIZE) - 2; // extra for tall trees
  const endTX = Math.ceil((cam.x + INTERNAL_WIDTH) / TILE_SIZE) + 1;
  const endTY = Math.ceil((cam.y + INTERNAL_HEIGHT) / TILE_SIZE) + 1;

  // Pass 1 — flat base tiles
  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      if (!map.inBounds(tx, ty)) continue;
      const dx = tx * TILE_SIZE - cam.x;
      const dy = ty * TILE_SIZE - cam.y;

      if (isLandmarkCoverage(map.landmarks, tx, ty)) {
        tileset.drawBase(ctx, TileId.Grass, dx, dy, tx, ty, map);
        continue;
      }

      tileset.drawBase(ctx, map.getTile(tx, ty), dx, dy, tx, ty, map);
    }
  }

  // Pass 2 — collect sortable overlays
  type Item = { sortY: number; draw: () => void };
  const items: Item[] = [];

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      if (!map.inBounds(tx, ty)) continue;
      if (isLandmarkCoverage(map.landmarks, tx, ty)) continue;
      const id = map.getTile(tx, ty);
      if (
        id !== TileId.Forest &&
        id !== TileId.TallGrass &&
        id !== TileId.Mountain &&
        id !== TileId.Peak
      ) {
        continue;
      }
      const dx = tx * TILE_SIZE - cam.x;
      const dy = ty * TILE_SIZE - cam.y;
      const sortY = (ty + 1) * TILE_SIZE;
      items.push({
        sortY,
        draw: () => tileset.drawOverlay(ctx, id, dx, dy, tx, ty),
      });
    }
  }

  for (const lm of map.landmarks) {
    if (
      lm.x + 4 < startTX ||
      lm.y + 2 < startTY ||
      lm.x > endTX ||
      lm.y > endTY + 4
    ) {
      continue;
    }
    const dx = lm.x * TILE_SIZE - cam.x;
    const dy = lm.y * TILE_SIZE - cam.y;
    const landmark: Landmark = lm;
    items.push({
      sortY: landmarkSortY(landmark),
      draw: () =>
        drawLandmarkSprite(ctx, tileset.landmarks, landmark.kind, dx, dy),
    });
  }

  for (const a of actors) {
    items.push({ sortY: a.sortY, draw: a.draw });
  }

  items.sort((a, b) => a.sortY - b.sortY || 0);
  for (const item of items) item.draw();
}
