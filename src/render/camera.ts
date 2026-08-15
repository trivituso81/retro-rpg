import {
  INTERNAL_HEIGHT,
  INTERNAL_WIDTH,
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
} from '../config';

export type Camera = {
  /** Top-left of the view in world pixels (whole pixels only). */
  x: number;
  y: number;
};

/**
 * Center the camera on a world-pixel point, then clamp so the view
 * never shows past the map edge (ocean margin stays on-screen intent).
 */
export function cameraFollow(
  cam: Camera,
  focusWorldX: number,
  focusWorldY: number,
): void {
  let x = Math.round(focusWorldX - INTERNAL_WIDTH / 2);
  let y = Math.round(focusWorldY - INTERNAL_HEIGHT / 2);

  const maxX = MAP_WIDTH * TILE_SIZE - INTERNAL_WIDTH;
  const maxY = MAP_HEIGHT * TILE_SIZE - INTERNAL_HEIGHT;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  cam.x = x;
  cam.y = y;
}

export function createCamera(): Camera {
  return { x: 0, y: 0 };
}
