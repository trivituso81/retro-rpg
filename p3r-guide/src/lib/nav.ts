export type ListItem = {
  to: string;
  title: string;
  subtitle: string;
  meta?: string;
};

export type TabDef = {
  to: string;
  label: string;
  /** Paths that light up this tab */
  match: (pathname: string) => boolean;
  icon: 'home' | 'guide' | 'party' | 'tools' | 'more';
};

export const guideItems: ListItem[] = [
  {
    to: '/walkthrough',
    title: 'Walkthrough',
    subtitle: 'Month-by-month calendar, deadlines, and story beats',
    meta: '12 months',
  },
  {
    to: '/tartarus',
    title: 'Tartarus',
    subtitle: 'Blocks, barriers, guardians, Monad, missing persons',
    meta: '6 blocks',
  },
  {
    to: '/bosses',
    title: 'Full Moon Bosses',
    subtitle: 'Affinities, phases, and strategies',
    meta: '12 ops',
  },
];

export const partyItems: ListItem[] = [
  {
    to: '/characters',
    title: 'Characters',
    subtitle: 'Party members, Personas, Theurgies, builds',
  },
  {
    to: '/social-links',
    title: 'Social Links',
    subtitle: 'Start dates, schedules, rewards, romance',
    meta: '22 Arcana',
  },
  {
    to: '/linked-episodes',
    title: 'Linked Episodes',
    subtitle: 'Windows and rewards for party side stories',
  },
  {
    to: '/personas',
    title: 'Personas & Fusion',
    subtitle: 'Fusion spells, special fusions, Heart Items',
  },
];

export const toolsItems: ListItem[] = [
  {
    to: '/items',
    title: 'Items & Shops',
    subtitle: 'Consumables, materials, shops, Tanaka\'s',
  },
  {
    to: '/equipment',
    title: 'Equipment',
    subtitle: 'Weapons, armor, footwear, accessories',
  },
  {
    to: '/requests',
    title: 'Elizabeth Requests',
    subtitle: 'Solutions, rewards, deadlines, checklist',
    meta: '101',
  },
  {
    to: '/school',
    title: 'Class & Exam Answers',
    subtitle: 'Every classroom question in order',
  },
];

export const moreItems: ListItem[] = [
  {
    to: '/tips',
    title: 'Tips & Strategy',
    subtitle: 'Combat, calendar, money, and QoL advice',
  },
  {
    to: '/secrets',
    title: 'Secrets',
    subtitle: 'Reaper, Elizabeth, endings, New Game+',
  },
];

export const tabs: TabDef[] = [
  {
    to: '/',
    label: 'Home',
    icon: 'home',
    match: (p) => p === '/',
  },
  {
    to: '/guide',
    label: 'Guide',
    icon: 'guide',
    match: (p) =>
      p === '/guide' || p.startsWith('/walkthrough') || p.startsWith('/tartarus') || p.startsWith('/bosses'),
  },
  {
    to: '/party',
    label: 'Party',
    icon: 'party',
    match: (p) =>
      p === '/party' ||
      p.startsWith('/characters') ||
      p.startsWith('/social-links') ||
      p.startsWith('/linked-episodes') ||
      p.startsWith('/personas'),
  },
  {
    to: '/tools',
    label: 'Tools',
    icon: 'tools',
    match: (p) =>
      p === '/tools' ||
      p.startsWith('/items') ||
      p.startsWith('/equipment') ||
      p.startsWith('/requests') ||
      p.startsWith('/school'),
  },
  {
    to: '/more',
    label: 'More',
    icon: 'more',
    match: (p) => p === '/more' || p.startsWith('/tips') || p.startsWith('/secrets'),
  },
];

/** Parent path for the iOS back button. Tab roots return null. */
export function parentPath(pathname: string): { to: string; label: string } | null {
  if (pathname === '/' || pathname === '/guide' || pathname === '/party' || pathname === '/tools' || pathname === '/more') {
    return null;
  }

  if (pathname.startsWith('/walkthrough/')) return { to: '/walkthrough', label: 'Walkthrough' };
  if (pathname === '/walkthrough' || pathname === '/tartarus' || pathname === '/bosses') {
    return { to: '/guide', label: 'Guide' };
  }

  if (pathname.startsWith('/characters/')) return { to: '/characters', label: 'Characters' };
  if (
    pathname === '/characters' ||
    pathname === '/social-links' ||
    pathname === '/linked-episodes' ||
    pathname === '/personas'
  ) {
    return { to: '/party', label: 'Party' };
  }

  if (pathname === '/items' || pathname === '/equipment' || pathname === '/requests' || pathname === '/school') {
    return { to: '/tools', label: 'Tools' };
  }

  if (pathname === '/tips' || pathname === '/secrets') return { to: '/more', label: 'More' };

  return { to: '/', label: 'Home' };
}

export function pageTitle(pathname: string): string {
  if (pathname === '/') return 'Home';
  if (pathname === '/guide') return 'Guide';
  if (pathname === '/party') return 'Party';
  if (pathname === '/tools') return 'Tools';
  if (pathname === '/more') return 'More';
  if (pathname.startsWith('/walkthrough')) return 'Walkthrough';
  if (pathname.startsWith('/tartarus')) return 'Tartarus';
  if (pathname.startsWith('/bosses')) return 'Bosses';
  if (pathname.startsWith('/characters')) return 'Characters';
  if (pathname.startsWith('/social-links')) return 'Social Links';
  if (pathname.startsWith('/linked-episodes')) return 'Linked Episodes';
  if (pathname.startsWith('/personas')) return 'Personas';
  if (pathname.startsWith('/items')) return 'Items';
  if (pathname.startsWith('/equipment')) return 'Equipment';
  if (pathname.startsWith('/requests')) return 'Requests';
  if (pathname.startsWith('/school')) return 'School';
  if (pathname.startsWith('/tips')) return 'Tips';
  if (pathname.startsWith('/secrets')) return 'Secrets';
  return 'Guide';
}

export function isTabRoot(pathname: string): boolean {
  return pathname === '/' || pathname === '/guide' || pathname === '/party' || pathname === '/tools' || pathname === '/more';
}
