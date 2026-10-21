/**
 * Cheeky village residents + their dialogue trees.
 */

import type { Facing } from '../config';

export type DialogueLine = {
  speaker: string;
  text: string;
};

export type Npc = {
  id: string;
  name: string;
  tileX: number;
  tileY: number;
  facing: Facing;
  /** Palette variant for procedural sprite. */
  palette: 'myrtle' | 'greg' | 'pixel' | 'quill' | 'cloak' | 'bard';
  /** Lines shown in order; wraps / restarts with a cheeky closer. */
  lines: DialogueLine[];
  /** Extra lines after you've heard the whole bit once. */
  encore: DialogueLine[];
};

export const VILLAGE_NPCS: Npc[] = [
  {
    id: 'myrtle',
    name: 'Granny Myrtle',
    tileX: 8,
    tileY: 8,
    facing: 'down',
    palette: 'myrtle',
    lines: [
      {
        speaker: 'Granny Myrtle',
        text: "Tom! Still wearing that mutant pajama top, I see.",
      },
      {
        speaker: 'Granny Myrtle',
        text: "I asked the X-Men to fix my Wi-Fi. Wolverine just clawed the router.",
      },
      {
        speaker: 'Granny Myrtle',
        text: "Now it works twice as fast and smells like ozone. Progress!",
      },
    ],
    encore: [
      {
        speaker: 'Granny Myrtle',
        text: "Go on, dear. The village isn't going to awkwardly monologue itself.",
      },
    ],
  },
  {
    id: 'greg',
    name: 'Greg',
    tileX: 28,
    tileY: 8,
    facing: 'left',
    palette: 'greg',
    lines: [
      {
        speaker: 'Greg',
        text: "Welcome to Greg's Forge! ...Okay, it's an espresso machine.",
      },
      {
        speaker: 'Greg',
        text: "I can temper steel, fold Damascus, and still burn toast.",
      },
      {
        speaker: 'Greg',
        text: "Your shirt says X-Men. Mine says 'X-Presso.' We are not the same.",
      },
    ],
    encore: [
      {
        speaker: 'Greg',
        text: "Latte art tip: if it looks like Magneto, you've steamed it too hard.",
      },
    ],
  },
  {
    id: 'pixel',
    name: 'Pixel',
    tileX: 8,
    tileY: 20,
    facing: 'right',
    palette: 'pixel',
    lines: [
      {
        speaker: 'Pixel',
        text: "PSSST. I speedrun talking to NPCs. You're frame 1 of my any%.",
      },
      {
        speaker: 'Pixel',
        text: "If I mash talk fast enough, does the plot skip? Asking for a friend.",
      },
      {
        speaker: 'Pixel',
        text: "Also your walk cycle is fire. Did Cursor write that or was it vibes?",
      },
    ],
    encore: [
      {
        speaker: 'Pixel',
        text: "New PB: heard your whole bit in 0.000 dialogue-skips. Wait—",
      },
    ],
  },
  {
    id: 'quill',
    name: 'Mayor Quill',
    tileX: 33,
    tileY: 20,
    facing: 'up',
    palette: 'quill',
    lines: [
      {
        speaker: 'Mayor Quill',
        text: "Tom! Perfect timing. We're pivoting the village to an MVP.",
      },
      {
        speaker: 'Mayor Quill',
        text: "Minimum Viable... Pastoral? We cut combat, inventory, AND dignity.",
      },
      {
        speaker: 'Mayor Quill',
        text: "Investors loved the X-Men shirt. Said it 'signals mutant synergy.'",
      },
    ],
    encore: [
      {
        speaker: 'Mayor Quill',
        text: "Remember: ship the joke, iterate the lore, never fix the well.",
      },
    ],
  },
  {
    id: 'cloak',
    name: '???',
    tileX: 20,
    tileY: 22,
    facing: 'up',
    palette: 'cloak',
    lines: [
      {
        speaker: '???',
        text: "I was promised turn-based combat. Random encounters. ATB gauges.",
      },
      {
        speaker: '???',
        text: "...This is just a village. With jokes. And a man in an X-Men tee.",
      },
      {
        speaker: '???',
        text: "Fine. I'll wait in the shadow of Feature Creep. Call me when Phase 9 ships.",
      },
    ],
    encore: [
      {
        speaker: '???',
        text: "*continues not fighting anything, dramatically*",
      },
    ],
  },
  {
    id: 'bard',
    name: 'Bard.exe',
    tileX: 18,
    tileY: 10,
    facing: 'down',
    palette: 'bard',
    lines: [
      {
        speaker: 'Bard.exe',
        text: "♪ Ohhh Tom of the short-cropped hair~ ♪",
      },
      {
        speaker: 'Bard.exe',
        text: "♪ Whose shirt could summon Storm if he stood in a square~ ♪",
      },
      {
        speaker: 'Bard.exe',
        text: "License note: this song is 100% public domain because I made it up.",
      },
    ],
    encore: [
      {
        speaker: 'Bard.exe',
        text: "Encore request denied. Buffer underrun. Try humming near the well.",
      },
    ],
  },
];

/** Building doorstep → dialogue when you inspect the house. */
export const BUILDING_LINES: Record<string, DialogueLine[]> = {
  "Myrtle's Cottage": [
    {
      speaker: 'Door',
      text: "A note: 'Tom — wipe your sneakers. White soles ≠ white carpet.'",
    },
  ],
  'Greg the "Blacksmith"': [
    {
      speaker: 'Door',
      text: "Smell of burnt milk and ambition. Classic Greg.",
    },
  ],
  'The Commit Inn': [
    {
      speaker: 'Innkeep (muffled)',
      text: "Rooms are free if you `git commit -m \"slept here\"`.",
    },
    {
      speaker: 'Innkeep (muffled)',
      text: "Force-pushing onto the guest book is a bannable offense.",
    },
  ],
  "Pixel's Pad": [
    {
      speaker: 'Door',
      text: "Sticky note: 'Out optimizing dialogue. BRB. (lying)'",
    },
  ],
  "Mayor Quill's Manor": [
    {
      speaker: 'Brass Plaque',
      text: "'Synergy starts at home.' — Quill, probably on LinkedIn.",
    },
  ],
  'Wishing Well': [
    {
      speaker: 'Well',
      text: "You toss in a coin. A voice echoes: 'Thanks for the series A.'",
    },
    {
      speaker: 'Well',
      text: "It gurgles something about product-market fit. You step back.",
    },
  ],
  'Welcome Sign': [
    {
      speaker: 'Sign',
      text: "WELCOME TO TOM'S VILLAGE — Population: vibes.",
    },
    {
      speaker: 'Sign',
      text: "House rule: if your shirt has mutants on it, you get plot armor.",
    },
  ],
  'Notice Board': [
    {
      speaker: 'Notice Board',
      text: "WANTED: someone to implement battles. Pay: exposure + one latte.",
    },
    {
      speaker: 'Notice Board',
      text: "LOST: my sense of urgency. Last seen in FUTURE.md.",
    },
  ],
};

export type NpcProgress = Record<string, number>;

export function nextNpcLines(
  npc: Npc,
  progress: NpcProgress,
): { lines: DialogueLine[]; progress: NpcProgress } {
  const seen = progress[npc.id] ?? 0;
  if (seen < npc.lines.length) {
    return {
      lines: [npc.lines[seen]!],
      progress: { ...progress, [npc.id]: seen + 1 },
    };
  }
  const encoreIndex = (seen - npc.lines.length) % npc.encore.length;
  return {
    lines: [npc.encore[encoreIndex]!],
    progress: { ...progress, [npc.id]: seen + 1 },
  };
}

export function npcAt(
  npcs: readonly Npc[],
  x: number,
  y: number,
): Npc | null {
  for (const n of npcs) {
    if (n.tileX === x && n.tileY === y) return n;
  }
  return null;
}

/** Tile in front of the player (for interact). */
export function facingTile(
  x: number,
  y: number,
  facing: Facing,
): { x: number; y: number } {
  switch (facing) {
    case 'up':
      return { x, y: y - 1 };
    case 'down':
      return { x, y: y + 1 };
    case 'left':
      return { x: x - 1, y };
    case 'right':
      return { x: x + 1, y };
  }
}
