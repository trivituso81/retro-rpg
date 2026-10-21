import {
  MAP_HEIGHT,
  MAP_WIDTH,
  PASSABLE,
  TILE_CHAR,
  TileId,
  type TileIdValue,
} from '../config';
import {
  blocksTile,
  VILLAGE_BUILDINGS,
  type Building,
} from '../village/buildings';
import { VILLAGE_ROWS } from '../village/mapdata';
import { VILLAGE_NPCS } from '../village/npcs';
import type { Landmark } from './landmarks';

export type WorldMap = {
  width: number;
  height: number;
  tiles: Uint8Array;
  collision: Uint8Array;
  landmarks: readonly Landmark[];
  buildings: readonly Building[];
  getTile(x: number, y: number): TileIdValue;
  isPassable(x: number, y: number): boolean;
  inBounds(x: number, y: number): boolean;
};

/** Extra village chars mapped onto overworld tile ids. */
const VILLAGE_CHAR: Record<string, TileIdValue> = {
  ...TILE_CHAR,
  '#': TileId.Forest,
  f: TileId.Forest,
  w: TileId.Grass,
};

function parseMap(): WorldMap {
  if (VILLAGE_ROWS.length !== MAP_HEIGHT) {
    throw new Error(
      `Map height ${VILLAGE_ROWS.length} !== expected ${MAP_HEIGHT}`,
    );
  }

  const tiles = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);
  const collision = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row = VILLAGE_ROWS[y]!;
    if (row.length !== MAP_WIDTH) {
      throw new Error(
        `Map row ${y} length ${row.length} !== expected ${MAP_WIDTH}`,
      );
    }
    for (let x = 0; x < MAP_WIDTH; x++) {
      const ch = row[x]!;
      const id = VILLAGE_CHAR[ch];
      if (id === undefined) {
        throw new Error(`Unknown map char '${ch}' at (${x},${y})`);
      }
      const i = y * MAP_WIDTH + x;
      tiles[i] = id;
      collision[i] = PASSABLE[id] ? 0 : 1;
    }
  }

  // Buildings block their footprint.
  for (const b of VILLAGE_BUILDINGS) {
    for (let oy = 0; oy < b.h; oy++) {
      for (let ox = 0; ox < b.w; ox++) {
        const tx = b.x + ox;
        const ty = b.y + oy;
        if (tx < 0 || ty < 0 || tx >= MAP_WIDTH || ty >= MAP_HEIGHT) continue;
        collision[ty * MAP_WIDTH + tx] = 1;
        // Keep grass under buildings for any peek-through
        tiles[ty * MAP_WIDTH + tx] = TileId.Grass;
      }
    }
  }

  // NPCs occupy a tile (solid while standing there).
  for (const n of VILLAGE_NPCS) {
    if (n.tileX >= 0 && n.tileY >= 0 && n.tileX < MAP_WIDTH && n.tileY < MAP_HEIGHT) {
      collision[n.tileY * MAP_WIDTH + n.tileX] = 1;
    }
  }

  return {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tiles,
    collision,
    landmarks: [],
    buildings: VILLAGE_BUILDINGS,
    inBounds(x, y) {
      return x >= 0 && y >= 0 && x < MAP_WIDTH && y < MAP_HEIGHT;
    },
    getTile(x, y) {
      if (!this.inBounds(x, y)) return TileId.Forest;
      return tiles[y * MAP_WIDTH + x]! as TileIdValue;
    },
    isPassable(x, y) {
      if (!this.inBounds(x, y)) return false;
      if (blocksTile(this.buildings, x, y)) return false;
      return collision[y * MAP_WIDTH + x] === 0;
    },
  };
}

/** Parsed once at boot. */
export const worldMap: WorldMap = parseMap();
