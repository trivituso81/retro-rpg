import {
  MAP_HEIGHT,
  MAP_WIDTH,
  PASSABLE,
  TILE_CHAR,
  type TileIdValue,
} from '../config';
import { MAP_ROWS } from './mapdata';

export type WorldMap = {
  width: number;
  height: number;
  tiles: Uint8Array;
  collision: Uint8Array;
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

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tiles,
    collision,
    inBounds(x, y) {
      return x >= 0 && y >= 0 && x < MAP_WIDTH && y < MAP_HEIGHT;
    },
    getTile(x, y) {
      if (!this.inBounds(x, y)) return 5 as TileIdValue; // ocean fallback
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
