import {
  LANDMARK_SIZE,
  MAP_HEIGHT,
  MAP_WIDTH,
  PASSABLE,
  TILE_CHAR,
  TileId,
  type TileIdValue,
} from '../config';
import {
  isLandmarkTile,
  kindFromTile,
  type Landmark,
} from './landmarks';
import { MAP_ROWS } from './mapdata';

export type WorldMap = {
  width: number;
  height: number;
  tiles: Uint8Array;
  collision: Uint8Array;
  landmarks: readonly Landmark[];
  getTile(x: number, y: number): TileIdValue;
  isPassable(x: number, y: number): boolean;
  inBounds(x: number, y: number): boolean;
};

function parseMap(): WorldMap {
  if (MAP_ROWS.length !== MAP_HEIGHT) {
    throw new Error(
      `Map height ${MAP_ROWS.length} !== expected ${MAP_HEIGHT}`,
    );
  }

  const tiles = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);
  const collision = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);
  const landmarks: Landmark[] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = MAP_ROWS[y]!;
    if (row.length !== MAP_WIDTH) {
      throw new Error(
        `Map row ${y} length ${row.length} !== expected ${MAP_WIDTH}`,
      );
    }
    for (let x = 0; x < MAP_WIDTH; x++) {
      const ch = row[x]!;
      const id = TILE_CHAR[ch];
      if (id === undefined) {
        throw new Error(`Unknown map char '${ch}' at (${x},${y})`);
      }
      const i = y * MAP_WIDTH + x;
      tiles[i] = id;
      collision[i] = PASSABLE[id] ? 0 : 1;
    }
  }

  // Collect 2×2 landmark anchors and clear the other three cells to grass
  // (the sprite covers them). Collision: castle solid; town/cave enterable.
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const id = tiles[y * MAP_WIDTH + x]! as TileIdValue;
      if (!isLandmarkTile(id)) continue;
      const kind = kindFromTile(id)!;
      if (x + LANDMARK_SIZE > MAP_WIDTH || y + LANDMARK_SIZE > MAP_HEIGHT) {
        throw new Error(`Landmark ${kind} at (${x},${y}) does not fit 2×2`);
      }
      landmarks.push({
        kind,
        x,
        y,
        destination: `${kind}-${x}-${y}`,
      });

      for (let oy = 0; oy < LANDMARK_SIZE; oy++) {
        for (let ox = 0; ox < LANDMARK_SIZE; ox++) {
          if (ox === 0 && oy === 0) continue;
          const i = (y + oy) * MAP_WIDTH + (x + ox);
          tiles[i] = TileId.Grass;
          // Castle walls block; town/cave keep passable grass under sprite
          // except we mark castle footprint blocked.
          if (kind === 'castle') {
            collision[i] = 1;
          } else {
            collision[i] = 0;
          }
        }
      }
      // Castle: whole footprint blocked (enter later via warp trigger).
      // Town/cave: passable so the player can step onto the entrance.
      if (kind === 'castle') {
        collision[y * MAP_WIDTH + x] = 1;
      }
    }
  }

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tiles,
    collision,
    landmarks,
    inBounds(x, y) {
      return x >= 0 && y >= 0 && x < MAP_WIDTH && y < MAP_HEIGHT;
    },
    getTile(x, y) {
      if (!this.inBounds(x, y)) return TileId.Ocean;
      return tiles[y * MAP_WIDTH + x]! as TileIdValue;
    },
    isPassable(x, y) {
      if (!this.inBounds(x, y)) return false;
      return collision[y * MAP_WIDTH + x] === 0;
    },
  };
}

/** Parsed once at boot. */
export const worldMap: WorldMap = parseMap();
