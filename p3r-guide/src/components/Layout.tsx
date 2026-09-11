import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { useStore } from '../lib/store';

const nav: { label: string; items: { to: string; icon: string; text: string }[] }[] = [
  {
    label: 'Guide',
    items: [
      { to: '/', icon: '◉', text: 'Overview' },
      { to: '/walkthrough', icon: '▤', text: 'Walkthrough' },
      { to: '/tartarus', icon: '▲', text: 'Tartarus' },
      { to: '/bosses', icon: '☾', text: 'Full Moon Bosses' },
    ],
  },
  {
    label: 'Party',
    items: [
      { to: '/characters', icon: '✦', text: 'Characters' },
      { to: '/social-links', icon: '☍', text: 'Social Links' },
      { to: '/linked-episodes', icon: '⚭', text: 'Linked Episodes' },
      { to: '/personas', icon: '◈', text: 'Personas & Fusion' },
    ],
  },
  {
    label: 'Database',
    items: [
      { to: '/items', icon: '⬢', text: 'Items & Shops' },
      { to: '/equipment', icon: '⚔', text: 'Equipment' },
      { to: '/requests', icon: '✓', text: 'Elizabeth Requests' },
      { to: '/school', icon: '✎', text: 'Class & Exam Answers' },
    ],
  },
  {
    label: 'Extras',
    items: [
      { to: '/tips', icon: '☆', text: 'Tips & Strategy' },
      { to: '/secrets', icon: '♆', text: 'Secrets' },
    ],
  },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { spoilers, setSpoilers } = useStore();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === '/' && !searchOpen && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-title">Persona 3 Reload</div>
            <div className="brand-sub">Complete Guide</div>
          </div>
        </NavLink>
        {nav.map((group) => (
          <nav key={group.label} className="nav-group" aria-label={group.label}>
            <div className="nav-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon" aria-hidden>
                  {item.icon}
                </span>
                {item.text}
              </NavLink>
            ))}
          </nav>
        ))}
        <div className="sidebar-footer">
          <span>Unofficial fan guide. Persona 3 Reload © ATLUS / SEGA.</span>
          <span>Progress and spoiler settings are saved in this browser.</span>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button type="button" className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation">
            ☰
          </button>
          <button type="button" className="search-btn" onClick={() => setSearchOpen(true)}>
            <span aria-hidden>⌕</span>
            <span>Search the guide…</span>
            <span className="kbd">Ctrl K</span>
          </button>
          <button
            type="button"
            className={`toggle ${spoilers ? 'on' : ''}`}
            onClick={() => setSpoilers(!spoilers)}
            title="Show or hide story spoilers across the guide"
          >
            <span className="dot" />
            {spoilers ? 'Spoilers shown' : 'Spoilers hidden'}
          </button>
        </div>
        <main className="content">
          <Outlet />
        </main>
      </div>

      {menuOpen && <div className="modal-backdrop" style={{ zIndex: 30 }} onClick={() => setMenuOpen(false)} />}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
