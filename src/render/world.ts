import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  TILE_SIZE,
  TileId,
} from '../config';
import type { Camera } from './camera';
import type { Tileset } from './tileset';
import { drawLandmarkSprite, isLandmarkCoverage } from '../world/landmarks';
import type { WorldMap } from '../world/map';

/**
 * Draw visible tiles (+1 tile bleed), then 2×2 landmark overlays.
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

  for (const lm of map.landmarks) {
    if (
      lm.x + 2 < startTX ||
      lm.y + 2 < startTY ||
      lm.x > endTX ||
      lm.y > endTY
    ) {
      continue;
    }
    const dx = lm.x * TILE_SIZE - cam.x;
    const dy = lm.y * TILE_SIZE - cam.y;
    drawLandmarkSprite(ctx, tileset.landmarks, lm.kind, dx, dy);
  }
}
