import type { Tip } from './types';

export const tips: Tip[] = [
  {
    id: 'one-more',
    category: 'Combat',
    title: 'Weaknesses, One More and All-Out Attacks are everything',
    body: [
      'Hitting a weakness or landing a critical knocks the enemy Down and gives you a One More (an extra action). Knock every enemy down, then trigger an All-Out Attack for massive Almighty damage.',
      'Use Fuuka\'s analysis (or Full Analysis after Rank up) to see affinities. Unknown enemies: probe with cheap elemental Gems rather than SP.',
      'Downed enemies also lose their next turn, so knocking down a dangerous boss add is often better than attacking a healthy one.',
    ],
  },
  {
    id: 'shift',
    category: 'Combat',
    title: 'Shift (Baton Pass) to whoever can exploit the next weakness',
    body: [
      'After a One More, press Shift to hand the extra turn to a teammate. The recipient gets boosted damage and recovers a little HP/SP. Chain Shifts to sweep mixed enemy groups without wasting SP on the wrong element.',
      'Shifting to a party member also charges their Theurgy gauge slightly, so cycle Shifts to keep everyone\'s Theurgy ready.',
    ],
  },
  {
    id: 'theurgy',
    category: 'Combat',
    title: 'Theurgy is your boss-killer and your emergency button',
    body: [
      'Every character has a personal charge condition (see Characters): Yukari charges from healing, Junpei from critical hits, Akihiko from acting while buffed, Mitsuru from debuffs/ailments, Fuuka from analysis, Aigis from physical skills, Koromaru from hitting weaknesses, Ken from acting below 50% SP, Shinjiro from acting below 50% HP.',
      'Theurgy skills never miss and deal far more than a normal skill of the same element. Teammates unlock a second Theurgy through their Linked Episodes or Social Link (Rank 5 for the girls). Save gauges for full-moon bosses, but do not hoard them into a Game Over: a well-timed Cadenza can turn a fight.',
      'The protagonist charges Theurgy by using Persona skills; equipping the Vitality Sash or similar accessories can increase gauge gain further.',
    ],
  },
  {
    id: 'buffs',
    category: 'Combat',
    title: 'Buffs and debuffs stack and last three turns',
    body: [
      'Tarukaja/Rakukaja/Sukukaja and the -unda debuffs are the strongest tools against bosses. Matarukaja from Fierce Sutras and Mitsuru/Akihiko\'s skills should be up for every full-moon fight.',
      'Dekaja/Dekunda remove enemy buffs/your debuffs. Many full-moon bosses (Hermit, Hanged Man) rely on buffing themselves: keep a Dekaja user around.',
      'Charge/Concentrate more than double the next physical/magic attack. Combine with a weakness and a Theurgy-boosted turn for massive damage.',
    ],
  },
  {
    id: 'tactics',
    category: 'Combat',
    title: 'Set Tactics per teammate instead of micromanaging everything',
    body: [
      '"Act Freely" is surprisingly smart in Reload and still gives you full manual control when you want it. "Conserve SP" during long Tartarus climbs; "Full Assault" for trash; "Heal/Support" for Yukari or Ken in boss fights.',
      'You can also directly control every party member. Toggle manual control for full-moon bosses so nobody wastes a turn on a repelled element.',
    ],
  },
  {
    id: 'ambush',
    category: 'Tartarus',
    title: 'Buy the Security Site Note and Ambush everything',
    body: [
      'From 7/9 the URL seller at Club Escapade sells the Security Site Note (5,000 yen). Use it at the dorm PC to unlock Ambushes: dashing into a Shadow from behind starts the battle with all enemies Down (or Distressed).',
      'Ambushes = guaranteed advantage, easy All-Out Attacks, and Theurgy gauge. Later notes (Assassin, History, Ninja) make Ambushes stronger.',
      'Conversely, never let a Shadow touch you from behind: enemy advantage gives them a free round.',
    ],
  },
  {
    id: 'explore-first',
    category: 'Tartarus',
    title: 'Clear each block in one or two nights, then leave it alone',
    body: [
      'Tartarus only extends after each full moon. Plan to hit the current block\'s barrier in one night (two at most) right after it opens, rescue any missing people, then spend the remaining evenings on Social Links and stats.',
      'Fuuka\'s "the Shadows are getting anxious" message means the Reaper is coming if you dawdle. Move on or use a Traesto Gem.',
      'Teammates can now leave with you at the entrance; there is no Tired status in Reload, so party members do not need rest days. Only SP limits your climb.',
    ],
  },
  {
    id: 'clock',
    category: 'Tartarus',
    title: 'Use the Great Clock and Twilight Fragments wisely',
    body: [
      'Twilight Fragments open locked chests (best loot) and power the Great Clock on certain floors, which levels two benched members up to the protagonist\'s level for 7 fragments.',
      'Fragments respawn around town every few days (shrine, mall, school, station). Grab them on the way to Social Link hangouts and prefer opening locked chests on boss/high floors.',
      'Do not spend fragments to catch up Shinjiro or Ken early; the Great Clock is most valuable in December/January when you decide your final party.',
    ],
  },
  {
    id: 'shuffle',
    category: 'Tartarus',
    title: 'Shuffle Time: take Major Arcana when offered',
    body: [
      'Shuffle Time now lets you pick a card directly. Persona cards fill the compendium; Wand cards give EXP; Sword cards give gear; Coin cards give yen; Cup cards restore HP/SP.',
      'Major Arcana cards (Fool, Magician, …) trigger a lasting Arcana Burst bonus for the rest of the visit and collecting a set of them yields bigger rewards. Take a Major Arcana whenever it appears unless you badly need a specific Persona.',
      'Rare gold Shadows and Rarity Fortunes produce the gem cards used at Mayoido Antiques.',
    ],
  },
  {
    id: 'reaper-warning',
    category: 'Tartarus',
    title: 'Respect the Reaper until you are ready to farm it',
    body: [
      'The Reaper spawns if you spend too long on one floor (Fuuka warns you twice). Until level 70+, leave via the nearest stairs or a Traesto Gem the moment you hear rattling chains.',
      'Early Reaper deaths still count as Game Over; a Homunculus does not save you from its physical attacks.',
    ],
  },
  {
    id: 'calendar-priorities',
    category: 'Calendar',
    title: 'The daily loop: school → after school Social Link → evening',
    body: [
      'Each day has an after-school slot and an evening slot. After school: Social Links, stat activities (clubs, Be Blue V, Chagall Cafe), or part-time jobs. Evening: Tartarus, dorm hangouts, studying, dorm PC, or the night-time Social Links (Devil, Tower, Moon, Hermit online).',
      'Time does not pass when you shop, so shop first. Talking to Elizabeth, the police station, the pharmacy and Mayoido Antiques are all free.',
      'Sundays and holidays give a daytime slot instead of school: use them for Social Links that are otherwise blocked (Aeon, Sun, Hanged Man, Hierophant).',
    ],
  },
  {
    id: 'stats',
    category: 'Calendar',
    title: 'Stat targets that gate Social Links',
    body: [
      'Academics: Rank 2 for Bebe (Temperance, 5/26), Rank 4 for Akinari (Sun), Rank 6 (Genius) for Mitsuru (Empress, 11/21). Charm: Rank 2 for Nozomi (Moon), Rank 4 for Tanaka (Devil), Rank 6 for Yukari (Lovers, 7/25). Courage: Rank 4 for Mutatsu (Tower) and Mamoru (Star), Rank 6 for Fuuka (Priestess, 6/19).',
      'Fastest gains: Academics – study at night (bonus after a Tartarus trip), Wakatsu Restaurant, library cram sessions; Charm – Chagall Cafe, Hagakure Ramen, top exam scores; Courage – Mandragora karaoke, horror films at Screen Shot on the right days.',
      'Fuuka\'s Courage 6 by 6/19 and Yukari\'s Charm 6 by 7/25 are the tightest stat deadlines; work on Courage first, then Charm, and leave Academics for later (it only needs to peak by 11/21).',
      'Answer class questions correctly (see School) and top your exams for large Academics/Charm jumps.',
    ],
  },
  {
    id: 'sl-first-pass',
    category: 'Social',
    title: 'Maxing all 22 Social Links in one run is possible',
    body: [
      'Reload removes the Tired status and links no longer reverse from neglect, but you still have finite days. Prioritize links with late start dates or strict schedules: Empress (Mitsuru, 11/21), Star (Mamoru, 8/2), Sun (Akinari, Sundays only), Aeon (Aigis, 1/8), and the night-only links (Devil, Tower).',
      'Carry a Persona of the matching Arcana for every hangout: it adds bonus points and can save a full rank-up meeting.',
      'Use the Dating Site Note (11/11, 3,000 yen) for +10 points to one Social Link if a link is one meeting behind.',
    ],
  },
  {
    id: 'romance',
    category: 'Social',
    title: 'Romance decisions',
    body: [
      'Romance options: Yukari, Fuuka, Mitsuru, Aigis, Chihiro, Yuko. The romance choice comes at Rank 9 of each link; picking friendship gives the same Rank 10 reward. Dating several girls at once causes jealousy scenes and only one can be your Christmas Eve (12/24) date, so save before 12/23 if you care which.',
      'Male party members and other links use Linked Episodes instead of ranks; there is no way to break them.',
    ],
  },
  {
    id: 'gifts',
    category: 'Social',
    title: 'Gifts and dorm nights',
    body: [
      'Spend evenings in the dorm on hangouts (cooking, gardening, studying, movie nights, PC). These raise HP/SP, teach Characteristics (passive perks such as a chance for Cup cards) and unlock the Linked Episode invitations.',
      'Gifts bought at the florist and Paulownia Mall boost female Social Links. Yukari likes the bonsai and vase; Mitsuru the bonsai; Fuuka the cactus. Give them at Rank 6+ when a hangout would otherwise be one point short.',
    ],
  },
  {
    id: 'money',
    category: 'Money & Items',
    title: 'Never be broke',
    body: [
      'Sell gems you do not need and every duplicate weapon Kurosawa cannot sell you. Old Documents (see Requests) pay 10,000–150,000 yen each.',
      'A Wealth Fortune (Club Escapade) the night you clear a block turns Coin cards into 5-figure payouts.',
      'Shop on sale days: Pharmacy Saturday, Police Station Monday. Tanaka\'s Sunday broadcasts are the only source of some items.',
      'Part-time jobs (Be Blue V, Chagall Cafe, Wakatsu, the Screen Shot film shop) are only worth it for their stat gains, not the money.',
    ],
  },
  {
    id: 'homunculus',
    category: 'Money & Items',
    title: 'Homunculus and instant-kill protection',
    body: [
      'Hama and Mudo (Light/Dark) skills instantly kill the protagonist and end the game. From mid-Tartarus onward carry Homunculi (Tanaka 11/8, Bunkichi rescue, Mayoido Antiques) or equip Null Light/Dark footwear (Shoes of Bane, Divine Pillar) and Personas that block the relevant element.',
    ],
  },
  {
    id: 'fusion-basics',
    category: 'Fusion',
    title: 'Fusion fundamentals',
    body: [
      'Fusing Personas of Arcana matching your Social Links gives them bonus EXP. Max Rank 10 links let the resulting Persona start several levels higher.',
      'Skill inheritance is free-select in Reload: pick the exact skills you want. Prioritize passive Boosts/Amps, Auto-buffs, Endure and a healing skill on the protagonist.',
      'Use the compendium: registering every Persona is cheap early and is needed for Fusion Spells (Theurgies) such as King and I (Black Frost + King Frost) and Armageddon (Helel + Satan).',
    ],
  },
  {
    id: 'skill-cards',
    category: 'Fusion',
    title: 'Skill cards and the Inari shrine',
    body: [
      'Skill cards can be duplicated at Naganaki Shrine (talk to the fox by the offering box). Leave a card and pick up a copy a few days later. Copies of Endure, Life Aid, Divine Grace, Ma-dyne spells and Boosts let you build any Persona you like.',
      'Skill cards also drop from Shuffle Time Sword cards and several Elizabeth requests.',
    ],
  },
  {
    id: 'difficulty',
    category: 'Quality of Life',
    title: 'Difficulty, network features and saves',
    body: [
      'Difficulty can be changed at any time from the system menu (except Merciless, which is fixed). Peaceful lets you revive the protagonist if you just want the story.',
      'Turn on Network Features: it shows what other players chose for daily activities and dialogue, which doubles as a hint system for class answers and Social Link choices.',
      'Keep two save files: one on the day before each full moon and a rotating file. Rewind is available via the built-in "Rewind Time" option after a Game Over on Normal and below.',
    ],
  },
  {
    id: 'dark-hour',
    category: 'Quality of Life',
    title: 'Dark Hour visits do not have to be long',
    body: [
      'You can enter Tartarus, talk to Elizabeth, do a fusion or turn in a request and leave without climbing. It still consumes the night, so bundle Velvet Room errands with a real climb whenever possible.',
      'Fusions and compendium summons can also be done in the Velvet Room during the day from Paulownia Mall (the blue door).',
    ],
  },
];
