import {
  DEFAULT_FACING,
  DEFAULT_SPAWN_X,
  DEFAULT_SPAWN_Y,
  SPRITE_WIDTH,
  SPRITE_Y_OFFSET,
  STEP_FRAMES,
  STUMBLE_FRAMES,
  TILE_SIZE,
  TURN_FRAMES,
  WALK_FRAME_PERIOD,
  type Facing,
} from '../config';
import { activeDir, type InputState } from '../input/input';
import type { WalkFrame } from '../render/sprites';
import type { WorldMap } from '../world/map';

export type PlayerState = 'idle' | 'turning' | 'stepping' | 'stumble';

export type Player = {
  tileX: number;
  tileY: number;
  /** Pixel offset within the current step (0..TILE_SIZE). */
  offsetX: number;
  offsetY: number;
  facing: Facing;
  state: PlayerState;
  /** Walk cycle frame. */
  walkFrame: WalkFrame;
  /** World-pixel center for camera. */
  worldX: number;
  worldY: number;
};

type Internal = Player & {
  turnTimer: number;
  stepTimer: number;
  stepFromX: number;
  stepFromY: number;
  stepToX: number;
  stepToY: number;
  walkTimer: number;
  walkPhase: number;
  stumbleTimer: number;
  buffered: Facing | null;
};

const DELTA: Record<Facing, { dx: number; dy: number }> = {
  down: { dx: 0, dy: 1 },
  up: { dx: 0, dy: -1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function syncWorld(p: Internal): void {
  p.worldX = p.tileX * TILE_SIZE + p.offsetX + TILE_SIZE / 2;
  p.worldY = p.tileY * TILE_SIZE + p.offsetY + TILE_SIZE / 2;
}

export function createPlayer(
  tileX = DEFAULT_SPAWN_X,
  tileY = DEFAULT_SPAWN_Y,
  facing: Facing = DEFAULT_FACING,
): Player {
  const p: Internal = {
    tileX,
    tileY,
    offsetX: 0,
    offsetY: 0,
    facing,
    state: 'idle',
    walkFrame: 0,
    worldX: 0,
    worldY: 0,
    turnTimer: 0,
    stepTimer: 0,
    stepFromX: tileX,
    stepFromY: tileY,
    stepToX: tileX,
    stepToY: tileY,
    walkTimer: 0,
    walkPhase: 0,
    stumbleTimer: 0,
    buffered: null,
  };
  syncWorld(p);
  return p;
}

function beginStep(p: Internal, facing: Facing, map: WorldMap): void {
  const { dx, dy } = DELTA[facing];
  const tx = p.tileX + dx;
  const ty = p.tileY + dy;
  p.facing = facing;

  if (!map.isPassable(tx, ty)) {
    p.state = 'stumble';
    p.stumbleTimer = STUMBLE_FRAMES;
    p.walkFrame = 0;
    p.offsetX = 0;
    p.offsetY = 0;
    syncWorld(p);
    return;
  }

  p.state = 'stepping';
  p.stepTimer = 0;
  p.walkTimer = 0;
  p.walkPhase = 0;
  p.walkFrame = 0;
  p.stepFromX = p.tileX;
  p.stepFromY = p.tileY;
  p.stepToX = tx;
  p.stepToY = ty;
  p.offsetX = 0;
  p.offsetY = 0;
}

function tryMove(p: Internal, dir: Facing, map: WorldMap): void {
  if (dir !== p.facing) {
    p.facing = dir;
    if (TURN_FRAMES > 0) {
      p.state = 'turning';
      p.turnTimer = TURN_FRAMES;
      p.walkFrame = 0;
      return;
    }
  }
  beginStep(p, dir, map);
}

/** Advance player one logic tick (1/60s). */
export function updatePlayer(
  player: Player,
  input: InputState,
  map: WorldMap,
): void {
  const p = player as Internal;
  const held = activeDir(input);

  if (p.state === 'idle') {
    p.walkFrame = 0;
    p.offsetX = 0;
    p.offsetY = 0;
    if (held) tryMove(p, held, map);
    syncWorld(p);
    return;
  }

  if (p.state === 'turning') {
    if (held) p.buffered = held;
    p.turnTimer -= 1;
    if (p.turnTimer <= 0) {
      const dir = p.buffered ?? p.facing;
      p.buffered = null;
      beginStep(p, dir, map);
    }
    syncWorld(p);
    return;
  }

  if (p.state === 'stumble') {
    if (held) p.buffered = held;
    p.stumbleTimer -= 1;
    const { dx, dy } = DELTA[p.facing];
    const t = p.stumbleTimer / STUMBLE_FRAMES;
    p.offsetX = dx * 2 * t;
    p.offsetY = dy * 2 * t;
    if (p.stumbleTimer <= 0) {
      p.offsetX = 0;
      p.offsetY = 0;
      p.state = 'idle';
      const dir = p.buffered ?? held;
      p.buffered = null;
      if (dir) tryMove(p, dir, map);
    }
    syncWorld(p);
    return;
  }

  if (p.state === 'stepping') {
    if (held) p.buffered = held;
    p.stepTimer += 1;
    const t = Math.min(1, p.stepTimer / STEP_FRAMES);
    const dx = (p.stepToX - p.stepFromX) * TILE_SIZE;
    const dy = (p.stepToY - p.stepFromY) * TILE_SIZE;
    p.offsetX = dx * t;
    p.offsetY = dy * t;

    p.walkTimer += 1;
    if (p.walkTimer >= WALK_FRAME_PERIOD) {
      p.walkTimer = 0;
      p.walkPhase = (p.walkPhase + 1) % 4;
    }
    const cycle: WalkFrame[] = [0, 1, 0, 2];
    p.walkFrame = cycle[p.walkPhase]!;

    if (p.stepTimer >= STEP_FRAMES) {
      p.tileX = p.stepToX;
      p.tileY = p.stepToY;
      p.offsetX = 0;
      p.offsetY = 0;
      p.walkFrame = 0;

      const next = p.buffered ?? held;
      p.buffered = null;
      if (next) {
        if (next !== p.facing && TURN_FRAMES > 0) {
          p.facing = next;
          p.state = 'turning';
          p.turnTimer = TURN_FRAMES;
        } else {
          beginStep(p, next, map);
        }
      } else {
        p.state = 'idle';
      }
    }
    syncWorld(p);
  }
}

/** Top-left draw position in world pixels. Feet at tile bottom; 8px depth lift. */
export function playerDrawPos(player: Player): { x: number; y: number } {
  const x =
    player.tileX * TILE_SIZE +
    player.offsetX +
    (TILE_SIZE - SPRITE_WIDTH) / 2;
  const y = player.tileY * TILE_SIZE + player.offsetY - SPRITE_Y_OFFSET;
  return { x, y };
}
