import { NavLink } from 'react-router-dom';
import { tabs, type TabDef } from '../lib/nav';

function TabIcon({ icon, active }: { icon: TabDef['icon']; active: boolean }) {
  const stroke = active ? 'var(--accent)' : 'currentColor';
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (icon) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
        </svg>
      );
    case 'guide':
      return (
        <svg {...common}>
          <path d="M5 4.5h10a3 3 0 0 1 3 3V20l-5.5-2.5L7 20V7.5a3 3 0 0 1 3-3" />
          <path d="M9 8h6M9 12h4" />
        </svg>
      );
    case 'party':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
          <path d="M14 14.2c1.3-.5 2.8-.4 4.5.8 1 .7 1.7 1.9 2 3" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...common}>
          <path d="M9 4h6l1 4h3v3l-2.2 1.2L18 18H6l1.2-5.8L5 11V8h3L9 4Z" />
          <path d="M10 18v2h4v-2" />
        </svg>
      );
    case 'more':
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="1.6" fill={stroke} stroke="none" />
          <circle cx="12" cy="12" r="1.6" fill={stroke} stroke="none" />
          <circle cx="18" cy="12" r="1.6" fill={stroke} stroke="none" />
        </svg>
      );
  }
}

export function TabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map((tab) => {
        const active = tab.match(pathname);
        return (
          <NavLink key={tab.to} to={tab.to} end={tab.to === '/'} className={`tab-item ${active ? 'active' : ''}`}>
            <TabIcon icon={tab.icon} active={active} />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
