export type Element =
  | 'Slash'
  | 'Strike'
  | 'Pierce'
  | 'Fire'
  | 'Ice'
  | 'Elec'
  | 'Wind'
  | 'Light'
  | 'Dark'
  | 'Almighty'
  | 'Support'
  | 'Healing';

export type Affinity = 'Weak' | 'Resist' | 'Null' | 'Repel' | 'Drain';

export type AffinityMap = Partial<Record<Exclude<Element, 'Almighty' | 'Support' | 'Healing'>, Affinity>>;

export interface Theurgy {
  name: string;
  persona: string;
  element: Element;
  effect: string;
}

export interface Character {
  id: string;
  name: string;
  jpName?: string;
  role: string;
  arcana: string;
  weapon: string;
  persona: string;
  evolvedPersona?: string;
  evolutionNote?: string;
  joins: string;
  element: string;
  affinities: string;
  theurgyCharge: string;
  theurgies: Theurgy[];
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  bio: string;
  spoilerBio?: string;
}

export interface Npc {
  id: string;
  name: string;
  group: 'Velvet Room' | 'Strega' | 'Dorm & School' | 'Other';
  description: string;
  spoiler?: string;
}

export interface FullMoonBoss {
  id: string;
  date: string;
  weekday: string;
  arcana: string;
  name: string;
  location: string;
  level: number;
  affinities: AffinityMap;
  noWeakness?: boolean;
  summary: string;
  strategy: string[];
  reward?: string;
  spoiler?: string;
}

export interface Guardian {
  floor: number;
  name: string;
  level: number;
  note?: string;
}

export interface TartarusBlock {
  id: string;
  name: string;
  subtitle: string;
  floors: [number, number];
  unlocks: string;
  barrier: number | null;
  guardians: Guardian[];
  oldDocuments?: { floor: number; doc: string }[];
  monadPassage?: number;
  notes: string[];
}

export interface MonadPassage {
  floor: number;
  block: string;
  cardRequired: string;
  enemies: string[];
  reward: string;
  strategy: string;
}

export interface WalkthroughEvent {
  date: string;
  title: string;
  kind: 'story' | 'fullmoon' | 'deadline' | 'social' | 'exam' | 'tartarus' | 'tip' | 'linked';
  detail: string;
  spoiler?: boolean;
}

export interface WalkthroughMonth {
  id: string;
  name: string;
  year: number;
  summary: string;
  objectives: string[];
  events: WalkthroughEvent[];
  tartarusGoal: string;
  socialFocus: string[];
}

export interface SocialLink {
  id: string;
  arcana: string;
  number: number;
  name: string;
  title: string;
  startDate: string;
  prerequisites: string;
  days: string;
  location: string;
  ultimatePersona: string;
  memento: string;
  romance: boolean;
  missable?: string;
  tips: string[];
  description: string;
}

export interface LinkedEpisode {
  character: string;
  persona: string;
  keyItem: string;
  charge?: string;
  episodes: { n: number; window: string; where: string; reward: string; note?: string }[];
}

export interface FusionSpell {
  name: string;
  element: Element;
  personas: [string, string];
  effect: string;
  howTo: string;
}

export interface PersonaEntry {
  name: string;
  arcana: string;
  level?: number;
  note: string;
  unlock?: string;
}

export interface HeartItem {
  level: number;
  persona: string;
  item: string;
  use: string;
}

export interface SpecialFusion {
  result: string;
  arcana: string;
  level: number;
  ingredients: string[];
  note?: string;
}

export interface Item {
  name: string;
  category:
    | 'HP Recovery'
    | 'SP Recovery'
    | 'Full Recovery'
    | 'Ailment Cure'
    | 'Revival'
    | 'Battle Support'
    | 'Dungeon'
    | 'Incense'
    | 'Dorm Cooking'
    | 'Key Item'
    | 'Material';
  effect: string;
  source: string;
}

export interface Shop {
  name: string;
  location: string;
  hours: string;
  sells: string;
  tip: string;
}

export interface Weapon {
  name: string;
  type: 'One-handed sword' | 'Two-handed sword' | 'Bow' | 'Fist' | 'Spear' | 'Rapier' | 'Firearm' | 'Knife' | 'Axe';
  user: string;
  attack: number;
  accuracy: number;
  effect: string;
  source: string;
  ultimate?: boolean;
}

export interface Armor {
  name: string;
  slot: 'Body' | 'Feet' | 'Accessory';
  defense?: number;
  effect: string;
  source: string;
}

export interface Request {
  n: number;
  title: string;
  task: string;
  solution: string;
  reward: string;
  deadline?: string;
  unlock?: string;
  missable?: boolean;
}

export interface ClassQuestion {
  date: string;
  question: string;
  answer: string;
  exam?: 'Midterm (May)' | 'Finals (July)' | 'Midterm (October)' | 'Finals (December)';
}

export interface Tip {
  id: string;
  category: 'Combat' | 'Tartarus' | 'Calendar' | 'Social' | 'Money & Items' | 'Fusion' | 'Quality of Life';
  title: string;
  body: string[];
}

export interface Secret {
  id: string;
  title: string;
  category: 'Superboss' | 'Hidden Content' | 'Story Choice' | 'Fusion' | 'Post-game';
  spoiler: boolean;
  body: string[];
}
