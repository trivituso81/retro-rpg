/**
 * Tiny procedural NPC sprites so villagers read as people, not props.
 */

import {
  NPC_SPRITE_HEIGHT,
  NPC_SPRITE_WIDTH,
  type Facing,
} from '../config';
import type { Npc } from '../village/npcs';

type Colors = {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  accent: string;
};

const PALETTES: Record<Npc['palette'], Colors> = {
  myrtle: {
    skin: '#e8c898',
    hair: '#e8e0d0',
    shirt: '#c06080',
    pants: '#5a4060',
    accent: '#f0d060',
  },
  greg: {
    skin: '#d4a878',
    hair: '#3a2818',
    shirt: '#6a6a70',
    pants: '#3a3848',
    accent: '#c87840',
  },
  pixel: {
    skin: '#f0d0a8',
    hair: '#40c878',
    shirt: '#3080e0',
    pants: '#203868',
    accent: '#f0e040',
  },
  quill: {
    skin: '#e0c090',
    hair: '#5a4030',
    shirt: '#c0a040',
    pants: '#403830',
    accent: '#e8d080',
  },
  cloak: {
    skin: '#c0a880',
    hair: '#1a1828',
    shirt: '#2a2840',
    pants: '#1a1830',
    accent: '#605888',
  },
  bard: {
    skin: '#e8c8a0',
    hair: '#a05030',
    shirt: '#e06050',
    pants: '#403060',
    accent: '#f0d060',
  },
};

const W = NPC_SPRITE_WIDTH;
const H = NPC_SPRITE_HEIGHT;

function drawNpcFrame(
  ctx: CanvasRenderingContext2D,
  colors: Colors,
  facing: Facing,
): void {
  const put = (x: number, y: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 1, 1);
  };

  put(5, 21, '#2a2018');
  put(6, 21, '#2a2018');
  put(9, 21, '#2a2018');
  put(10, 21, '#2a2018');
  put(5, 22, '#1a1810');
  put(6, 22, '#1a1810');
  put(9, 22, '#1a1810');
  put(10, 22, '#1a1810');

  for (let y = 17; y <= 20; y++) {
    put(5, y, colors.pants);
    put(6, y, colors.pants);
    put(9, y, colors.pants);
    put(10, y, colors.pants);
  }

  for (let y = 11; y <= 16; y++) {
    for (let x = 4; x <= 11; x++) put(x, y, colors.shirt);
  }
  put(5, 12, colors.accent);
  put(6, 13, colors.accent);

  for (let y = 4; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) put(x, y, colors.skin);
  }
  for (let x = 4; x <= 11; x++) put(x, 3, colors.hair);
  for (let x = 4; x <= 11; x++) put(x, 4, colors.hair);
  put(4, 5, colors.hair);
  put(11, 5, colors.hair);

  if (facing === 'down') {
    put(6, 7, '#1a1810');
    put(9, 7, '#1a1810');
    put(7, 9, '#c05050');
    put(8, 9, '#c05050');
  } else if (facing === 'up') {
    for (let y = 5; y <= 8; y++) {
      for (let x = 5; x <= 10; x++) put(x, y, colors.hair);
    }
  } else {
    put(facing === 'right' ? 9 : 6, 7, '#1a1810');
  }

  put(3, 12, colors.skin);
  put(3, 13, colors.shirt);
  put(12, 12, colors.skin);
  put(12, 13, colors.shirt);

  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const solid = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return false;
    return d[(y * W + x) * 4 + 3]! > 0;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!solid(x, y)) continue;
      for (const [nx, ny] of [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ] as const) {
        if (nx >= 0 && ny >= 0 && nx < W && ny < H && !solid(nx, ny)) {
          put(nx, ny, '#0a0810');
        }
      }
    }
  }
}

export type NpcSpriteSheet = {
  draw(
    ctx: CanvasRenderingContext2D,
    palette: Npc['palette'],
    facing: Facing,
    dx: number,
    dy: number,
    scale?: number,
  ): void;
};

export function createNpcSprites(): NpcSpriteSheet {
  const canvas = document.createElement('canvas');
  const palettes = Object.keys(PALETTES) as Npc['palette'][];
  const facings: Facing[] = ['down', 'up', 'left', 'right'];
  canvas.width = W * facings.length;
  canvas.height = H * palettes.length;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const temp = document.createElement('canvas');
  temp.width = W;
  temp.height = H;
  const tctx = temp.getContext('2d')!;

  palettes.forEach((pal, row) => {
    facings.forEach((facing, col) => {
      tctx.clearRect(0, 0, W, H);
      drawNpcFrame(tctx, PALETTES[pal], facing);
      ctx.drawImage(temp, col * W, row * H);
    });
  });

  const facingCol = (f: Facing) =>
    f === 'down' ? 0 : f === 'up' ? 1 : f === 'left' ? 2 : 3;

  return {
    draw(dest, palette, facing, dx, dy, scale = 1) {
      const row = palettes.indexOf(palette);
      const col = facingCol(facing);
      dest.drawImage(
        canvas,
        col * W,
        row * H,
        W,
        H,
        dx,
        dy,
        W * scale,
        H * scale,
      );
    },
  };
}
