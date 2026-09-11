import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { AffinityMap } from '../data/types';

/** In-page anchor that works with HashRouter (a plain href="#id" would be treated as a route). */
export function Anchor({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <Link to={`${pathname}#${id}`} className={className}>
      {children}
    </Link>
  );
}

export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="page-header">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}

export function Card({ title, badges, children, id }: { title?: ReactNode; badges?: ReactNode; children: ReactNode; id?: string }) {
  return (
    <section className="card" id={id}>
      {(title || badges) && (
        <div className="card-title">
          {title && <h2>{title}</h2>}
          {badges}
        </div>
      )}
      {children}
    </section>
  );
}

export function Badge({ children, tone }: { children: ReactNode; tone?: 'gold' | 'red' | 'green' | 'grey' | string }) {
  return <span className={`badge ${tone ?? ''}`}>{children}</span>;
}

export function Spoiler({ children, label = 'Spoiler' }: { children: ReactNode; label?: string }) {
  const { spoilers } = useStore();
  const [revealed, setRevealed] = useState(false);
  const hidden = !spoilers && !revealed;
  return (
    <div className={`spoiler ${hidden ? 'hidden' : ''}`}>
      <div className="spoiler-tag">
        <span>{label}</span>
        {hidden && (
          <button type="button" onClick={() => setRevealed(true)}>
            Reveal
          </button>
        )}
      </div>
      <div className="spoiler-body">{children}</div>
    </div>
  );
}

export function Affinities({ map, noWeakness }: { map: AffinityMap; noWeakness?: boolean }) {
  const entries = Object.entries(map);
  if (entries.length === 0) {
    return <span className="muted small">{noWeakness ? 'No exploitable weakness' : 'No notable affinities'}</span>;
  }
  return (
    <div className="affinity">
      {entries.map(([el, aff]) => (
        <span key={el} className={`aff ${aff}`}>
          {aff} {el}
        </span>
      ))}
      {noWeakness && <span className="aff">No weakness</span>}
    </div>
  );
}

export function Checklist({ prefix, items }: { prefix: string; items: { id: string; title: ReactNode; detail?: ReactNode }[] }) {
  const { done, toggleDone } = useStore();
  const count = items.filter((i) => done.has(`${prefix}:${i.id}`)).length;
  return (
    <div>
      <div className="controls">
        <span className="small muted">
          {count} / {items.length} done
        </span>
        <div className="progress">
          <div style={{ width: `${items.length ? (count / items.length) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="detail-list">
        {items.map((item) => {
          const key = `${prefix}:${item.id}`;
          const isDone = done.has(key);
          return (
            <label key={item.id} className={`check ${isDone ? 'done' : ''}`}>
              <input type="checkbox" checked={isDone} onChange={() => toggleDone(key)} />
              <div>
                <div className="check-title">{item.title}</div>
                {item.detail && <div className="small muted">{item.detail}</div>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  allLabel = 'All',
  label,
}: {
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  allLabel?: string;
  label?: (o: T) => string;
}) {
  return (
    <div className="chip-row">
      <button type="button" className={`chip ${value === null ? 'active' : ''}`} onClick={() => onChange(null)}>
        {allLabel}
      </button>
      {options.map((o) => (
        <button key={o} type="button" className={`chip ${value === o ? 'active' : ''}`} onClick={() => onChange(o)}>
          {label ? label(o) : o}
        </button>
      ))}
    </div>
  );
}

export function filterBy<T>(items: T[], query: string, pick: (item: T) => string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((it) => pick(it).toLowerCase().includes(q));
}
