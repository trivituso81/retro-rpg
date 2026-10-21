import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  TILE_SIZE,
  TileId,
} from '../config';
import type { Camera } from './camera';
import type { Tileset } from './tileset';
import { isLandmarkCoverage } from '../world/landmarks';
import type { WorldMap } from '../world/map';

/**
 * Draw visible tiles, then village building overlays.
 */
export function drawWorld(
  ctx: CanvasRenderingContext2D,
  map: WorldMap,
  tileset: Tileset,
  cam: Camera,
): void {
  const startTX = Math.floor(cam.x / TILE_SIZE) - 1;
  const startTY = Math.floor(cam.y / TILE_SIZE) - 1;
  const endTX = Math.ceil((cam.x + INTERNAL_WIDTH) / TILE_SIZE) + 1;
  const endTY = Math.ceil((cam.y + INTERNAL_HEIGHT) / TILE_SIZE) + 1;

  for (let ty = startTY; ty < endTY; ty++) {
    for (let tx = startTX; tx < endTX; tx++) {
      if (!map.inBounds(tx, ty)) continue;
      const dx = tx * TILE_SIZE - cam.x;
      const dy = ty * TILE_SIZE - cam.y;

      if (isLandmarkCoverage(map.landmarks, tx, ty)) {
        tileset.drawTile(ctx, TileId.Grass, dx, dy, tx, ty, map);
        continue;
      }

      tileset.drawTile(ctx, map.getTile(tx, ty), dx, dy, tx, ty, map);
    }
  }

  for (const b of map.buildings) {
    if (
      b.x + b.w < startTX ||
      b.y + b.h < startTY ||
      b.x > endTX ||
      b.y > endTY
    ) {
      continue;
    }
    const dx = b.x * TILE_SIZE - cam.x;
    const dy = b.y * TILE_SIZE - cam.y;
    const sprite = tileset.buildings[b.kind];
    ctx.drawImage(sprite, dx, dy);
  }
}
