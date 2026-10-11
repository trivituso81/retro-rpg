import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { TabBar } from './TabBar';
import { useStore } from '../lib/store';
import { isTabRoot, pageTitle, parentPath } from '../lib/nav';

export function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { spoilers, setSpoilers } = useStore();
  const location = useLocation();
  const back = parentPath(location.pathname);
  const title = pageTitle(location.pathname);
  const tabRoot = isTabRoot(location.pathname);

  useEffect(() => {
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
      if (e.key === '/' && !searchOpen && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  return (
    <div className="app-shell">
      <header className={`navbar ${tabRoot ? 'root' : 'nested'}`}>
        <div className="navbar-leading">
          {back ? (
            <Link to={back.to} className="nav-back" aria-label={`Back to ${back.label}`}>
              <span aria-hidden className="nav-back-chevron">
                ‹
              </span>
              <span className="nav-back-label">{back.label}</span>
            </Link>
          ) : (
            <span className="navbar-brand">P3 Reload</span>
          )}
        </div>
        {!tabRoot && <div className="navbar-title">{title}</div>}
        <div className="navbar-trailing">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button
            type="button"
            className={`spoiler-chip ${spoilers ? 'on' : ''}`}
            onClick={() => setSpoilers(!spoilers)}
            title="Show or hide story spoilers"
            aria-pressed={spoilers}
          >
            {spoilers ? 'Spoilers on' : 'Spoilers off'}
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <TabBar pathname={location.pathname} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
