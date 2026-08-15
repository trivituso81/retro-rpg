import {
  DEFAULT_FACING,
  DEFAULT_SPAWN_X,
  DEFAULT_SPAWN_Y,
  MAP_HEIGHT,
  MAP_WIDTH,
  SAVE_DEBOUNCE_MS,
  type Facing,
} from '../config';
import type { Player } from '../entity/player';
import type { WorldMap } from '../world/map';

export const SAVE_KEY = 'overworld.save.v2';

const FACINGS: readonly Facing[] = ['down', 'up', 'left', 'right'];

export type SaveData = {
  v: 1;
  x: number;
  y: number;
  facing: Facing;
};

export function serializePlayer(player: Player): SaveData {
  return {
    v: 1,
    x: player.tileX,
    y: player.tileY,
    facing: player.facing,
  };
}

export function validateSave(
  raw: unknown,
  map: WorldMap,
): SaveData | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (typeof o.x !== 'number' || typeof o.y !== 'number') return null;
  if (!Number.isInteger(o.x) || !Number.isInteger(o.y)) return null;
  if (o.x < 0 || o.y < 0 || o.x >= MAP_WIDTH || o.y >= MAP_HEIGHT) {
    return null;
  }
  if (typeof o.facing !== 'string' || !FACINGS.includes(o.facing as Facing)) {
    return null;
  }
  if (!map.isPassable(o.x, o.y)) return null;
  return {
    v: 1,
    x: o.x,
    y: o.y,
    facing: o.facing as Facing,
  };
}

export function loadSave(map: WorldMap): SaveData | null {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    if (!text) return null;
    return validateSave(JSON.parse(text) as unknown, map);
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Quota / private mode — ignore.
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function defaultSave(): SaveData {
  return {
    v: 1,
    x: DEFAULT_SPAWN_X,
    y: DEFAULT_SPAWN_Y,
    facing: DEFAULT_FACING,
  };
}

/** Debounced writer; flush() forces an immediate write. */
export function createSaveScheduler(
  getData: () => SaveData,
): { schedule: () => void; flush: () => void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    writeSave(getData());
  };

  const schedule = () => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      writeSave(getData());
    }, SAVE_DEBOUNCE_MS);
  };

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return { schedule, flush, cancel };
}
