import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  TILE_SIZE,
} from '../config';
import type { Camera } from './camera';
import type { Tileset } from './tileset';
import type { WorldMap } from '../world/map';

/**
 * Draw visible tiles (+1 tile bleed) into the internal buffer.
 * At 512×448 with 32px tiles that is still ~17×15 tiles.
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
      tileset.drawTile(ctx, map.getTile(tx, ty), dx, dy, tx, ty);
    }
  }
}
