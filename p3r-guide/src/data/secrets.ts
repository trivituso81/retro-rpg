import type { Secret } from './types';

export const secrets: Secret[] = [
  {
    id: 'reaper',
    title: 'The Reaper (Death) — farming and defeating it',
    category: 'Superboss',
    spoiler: false,
    body: [
      'The Reaper appears when you linger on a Tartarus floor: Fuuka warns you first, then chains rattle and it spawns near you. It has no weakness, nulls Light and Dark, and cycles through heavy single-target and multi-target elemental spells, powerful physical attacks and Megidolaon. Homunculi will not save you from its damage, so bring revival items.',
      'Preparation: a party around level 75+, Personas that resist (or null) its elements, and high-defense armor. Yukari with Mediarahan and Amrita Soda for cleanup, Akihiko for Matarukaja/Rakunda, and a Charge-based physical damage dealer (Aigis, Koromaru or the protagonist with a strong physical Persona).',
      'Strategy: keep Rakunda/Sukunda on it and Matarukaja/Marakukaja on yourselves, heal every turn, and burst with Charge/Concentrate + Theurgy or Almighty attacks. Never end your turn with a party member Down. Because it has no weakness, elemental Amps on whatever element you can boost most are the best damage source.',
      'Rewards: the Bloody Button (Request #100 → Divine Pillar accessory) plus large EXP and rare material drops on every win — one of the fastest late-game level-up methods. It can be summoned again on later visits.',
    ],
  },
  {
    id: 'elizabeth',
    title: 'Elizabeth — the ultimate adversary (Request #101)',
    category: 'Superboss',
    spoiler: false,
    body: [
      'Unlock: clear the Monad Passage on floor 255 (Request #99) and defeat the Reaper (Request #100), accept Request #101, then enter the Monad door on Adamah floor 255 with no party members. The fight is available immediately; you do not need to wait for 1/31.',
      'Rules: Elizabeth has 20,000 HP and fights you 1-on-1 (Fuuka still navigates). Breaking any rule makes her summon Pixie and cast a 9,999-damage Megidolaon every turn until you die. Rules: never Null, Drain or Repel any attack she uses (Resist is fine; this includes accessories and Attack/Magic Mirrors), never use Tetrakarn/Makarakarn, never use Armageddon except as the killing blow, and finish within 50 turns.',
      'Phases: below 13,000 HP she announces the "curtain rising" and next turn fires a scripted 9,999 Megidolaon — switch to a Persona with Enduring Soul beforehand. You then have about three turns to push her below 10,000 HP or she fires another. At 10,000 she uses Diarahan + Heat Riser (back to 20,000) and starts summoning two Personas per turn (e.g., Jack Frost & Thor, Cu Chulainn & Metatron).',
      'Finish: when you bring her below 10,000 HP a second time she casts one more 9,999 Megidolaon; survive it with a Persona that still has Endure, then use the Armageddon Theurgy (requires Helel and Satan registered and a full gauge) on your next action. Nothing else ends the fight; if you do not have Armageddon ready she heals to full and repeats.',
      'Build: Orpheus Telos or Messiah with Endure, Enduring Soul (on a second Persona), Debilitate, Heat Riser, Concentrate and Almighty Boost/Amp; use Debilitator Sutras and keep a calculator handy to track her HP. Shoes of Bane (Null Dark) are off-limits because they null — use a Dark-resist Persona or rely on Endure instead. Her summons telegraph the next element, so switch to a Persona that merely resists it.',
      'Reward: the Platinum Bookmark, and turning in Request #101 grants the Omnipotent Orb (Null everything except Almighty).',
    ],
  },
  {
    id: 'monad',
    title: 'Monad Passages and Monad Doors',
    category: 'Hidden Content',
    spoiler: false,
    body: [
      'Monad Passages (floors 91, 117, 143, 171, 197, 225, 255) are hidden gauntlets unlocked by picking the Major Arcana card shown at the entrance during a Shuffle Time in that block. Inside, you fight several powerful Shadow groups back-to-back for rare gear and Requests #37 and #99.',
      'Monad Doors are the gold doors that appear on regular floors after clearing a block. They lead to one-room boss fights against out-of-depth Shadows with excellent drops. They are optional but are the best EXP per minute in each block.',
      'On 1/31 (the Promised Day), the 255F Monad door becomes the entrance to the ultimate adversary if Request #101 is active.',
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy and Rare Shadows',
    category: 'Hidden Content',
    spoiler: false,
    body: [
      'Golden Rare Shadows (Wealth Hand etc.) flee quickly and drop gems and coins. Use a Rarity Fortune (Club Escapade) to increase spawns; they are required for Requests #36 and #64.',
      'Greedy Shadows are event encounters where Fuuka reports a Shadow "acting strange" and asks you to pick left or right. Guessing correctly leads to a fight against a Shadow that drops a Gold Medal (Request #88) and lots of yen. A Wealth Fortune helps them appear.',
    ],
  },
  {
    id: 'club-choices',
    title: 'Answer choices that quietly matter',
    category: 'Story Choice',
    spoiler: false,
    body: [
      'Join a sports club (Kendo, Track or Swim) on 4/23 to start Chariot (Kazushi) and later Strength (Yuko). The Art Club (6/17) starts Fortune (Keisuke); Music Club and Photography Club also exist but have no Social Link.',
      'On 4/27 accept Mitsuru\'s Student Council request for Emperor (Hidetoshi). On 4/25 pick the Persimmon Leaf in the 1F corridor to start Hierophant at Bookworms.',
      'The Innocent Sin Online game Junpei gives you (Hermit, "Maya") can only be played on days off — Sundays and holidays — from your room, so plan those days around it.',
      'Yuko (Strength) only starts after you have walked her home twice during Kazushi\'s Chariot link (she refuses twice first); keep the sports club link moving in April/May so she is available by early summer.',
    ],
  },
  {
    id: 'chidori',
    title: 'Saving Chidori',
    category: 'Story Choice',
    spoiler: true,
    body: [
      'Reload changed the method from FES/Portable. On 11/6 you see a scene of Junpei and Chidori at the hospital. On 11/7 (or any day up to 11/11) accept Junpei\'s after-school invitation (his Linked Episode 3): he considers buying flowers for Chidori but gives up.',
      'The next day buy the White Flower (250 yen) at Rafflesia, the florist in Port Island Station, and give it to Junpei at the dorm in the evening. Both steps must be done before 11/21. A later evening phone call from Mitsuru confirms the flag is set.',
      'Chidori\'s sacrifice on 11/22 still plays out and Junpei still gets Trismegistus, but on 1/21 you, Junpei and Mitsuru visit the hospital and find her alive (without her memories of the Dark Hour). This costs your after-school slot on 1/21; there is no other reward or penalty.',
    ],
  },
  {
    id: 'shinjiro',
    title: 'Shinjiro\'s Linked Episodes and Hell Biker',
    category: 'Story Choice',
    spoiler: true,
    body: [
      'Unlike Persona 3 Portable\'s female route, Shinjiro cannot be saved in Reload: he is shot protecting Ken on 10/4 no matter what you do. What you can change is how much of his story you see and whether you unlock his Persona.',
      'His Linked Episodes run only from 9/4 to 10/2. Answer his texts the night they arrive, ask Mitsuru (faculty hallway) to invite him back to school, then shuttle between them until he hands you an Extension Form. When Mitsuru texts you about it, choose "Wait a minute" and keep the form instead of handing it over, then return it to Shinjiro at Port Island Station Outskirts.',
      'On 10/28 Ikutsuki asks you to clean out his room: you recover his equipment, a Blade of Fury skill card and the Incomplete Form key item, which unlocks fusing Hell Biker (Hanged Man, Lv 65, e.g. Naga Raja x Throne).',
      'Shinjiro leaves the party on 10/4 for good, so do not invest Twilight Fragments in leveling him with the Great Clock and unequip his best gear on 10/3.',
    ],
  },
  {
    id: 'ryoji',
    title: 'The 12/31 choice',
    category: 'Story Choice',
    spoiler: true,
    body: [
      'On 12/31 Ryoji offers to be killed. Choosing to kill him ends the game immediately with the "bad" ending: everyone forgets and the credits roll; you cannot continue to January. Choosing to spare him unlocks January, the Judgement Social Link, Aeon\'s later ranks and the true ending.',
      'Save before the choice if you want to see both endings for the trophy list; the bad ending is not required for anything except viewing.',
    ],
  },
  {
    id: 'aigis-aeon',
    title: 'Aigis\'s Aeon Social Link',
    category: 'Story Choice',
    spoiler: true,
    body: [
      'The Aeon Social Link with Aigis only starts on 1/8 (Classroom 2F, Mon/Wed/Fri/Sat; not on 1/25, Career Counseling Day) with no stat requirements, and it does not rank up automatically. With fewer than 20 usable days, bring an Aeon Persona to every meeting, hang out with her at the dorm at night, and consider a Dating Site Note for +10 points.',
      'Rank 10 grants the Charred Screw, which unlocks fusing Metatron (Aeon, Lv 87) — the last piece for a complete compendium and Orpheus Telos. The Charred Screw carries over to New Game+ if you run out of time to fuse him.',
      'Rank 9 offers a romance choice; either path gives the same reward, but the romance changes her dialogue on 1/31 and in the ending scene.',
    ],
  },
  {
    id: 'armageddon',
    title: 'Armageddon, Orpheus Telos and Messiah',
    category: 'Fusion',
    spoiler: false,
    body: [
      'Armageddon is the strongest Fusion Spell: 9,999 Almighty damage to all enemies. You need Helel (Star, Lv 88) and Satan (Judgement, Lv 82) both registered in the compendium and enough Theurgy gauge. Helel requires the Star link maxed; Satan the Judgement link (January).',
      'Orpheus Telos (Fool, Lv 91) can only be fused after maxing every Social Link and obtaining all 22 mementos. It inherits any skills you choose and has no weaknesses — the standard Elizabeth-fight Persona.',
      'Messiah (Judgement) is fused from Orpheus + Thanatos after finishing the Judgement Social Link (Rank 10 on 1/31). It grants the "Path to Salvation" trophy and learns Salvation, God\'s Hand and Megidolaon.',
    ],
  },
  {
    id: 'thanatos',
    title: 'Thanatos and the Death arcana',
    category: 'Fusion',
    spoiler: true,
    body: [
      'Thanatos (Death) requires the Death Social Link (Pharos), which ranks up automatically through the story and maxes in early November. Fusion: Ghoul x Pale Rider x Loa x Samael x Mot — a five-Persona special fusion. Thanatos is also one half of Messiah.',
      'Alice (Death) is a separate special fusion — Pixie x Lilim x Narcissus x Titania — needed for Request #86, and her Die For Me! is the best Dark instant-kill in the game.',
    ],
  },
  {
    id: 'ngplus',
    title: 'New Game+ carry-overs and post-game',
    category: 'Post-game',
    spoiler: false,
    body: [
      'Save your Clear Data after the credits and load it to start a New Cycle (NG+). Carried over: the protagonist\'s level and HP/SP bonuses, Social Stats, the full Persona Compendium (summons still cost money) with stat boosts intact, Shadow analysis data, items, equipment, skill cards, gems/materials, money, Twilight Fragments, costumes (except the SEES uniforms), Persona-unlocking key items (Charred Screw etc.), souvenirs and play time.',
      'Not carried over: Social Link ranks, party member levels and evolved Personas, current Persona stock, Tartarus progress, Elizabeth\'s requests, missing persons and Shuffle Time cards. Starting NG+ on Merciless discards almost all carry-overs (only costumes, souvenirs and play time remain).',
      'Trophy hunters: Orpheus Telos and Messiah require maxing all Social Links in a single run and finishing Judgement on 1/31. NG+ with maxed stats and the Compendium makes a 100% run straightforward. Episode Aigis: The Answer (Expansion Pass DLC) continues the story after the ending.',
    ],
  },
  {
    id: 'hidden-scenes',
    title: 'Small hidden scenes and Easter eggs',
    category: 'Hidden Content',
    spoiler: false,
    body: [
      'Check the dorm sign-in board and the fridge regularly: teammates leave notes, and food you store (like the Lukewarm Taiyaki for Request #38) changes state after a day.',
      'Koromaru can be walked at night from the dorm lounge with a teammate of your choice for Characteristics, items and unique dialogue at Naganaki Shrine (from 8/22).',
      'The arcade in Paulownia Mall lets you spend yen to raise a Persona\'s stats (Game Panic), and the crane game outside it hands out Jack Frost Dolls for Request #19. Wild Duck Burger\'s Big Eater Challenge (Request #11) unlocks a weekend set that boosts Courage.',
      'Kyoto school trip (11/16–11/19): talk to every party member at the inn and buy the three vending-machine drinks for Request #96; the hot-spring segment has a hidden outcome if you avoid being caught by the girls.',
    ],
  },
];
