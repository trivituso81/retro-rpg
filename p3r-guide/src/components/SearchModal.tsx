import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../lib/searchIndex';
import { useStore } from '../lib/store';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { spoilers } = useStore();

  const results = useMemo(() => {
    const r = search(q);
    return spoilers ? r : r.filter((e) => !e.spoiler);
  }, [q, spoilers]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active].to);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search the guide">
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search bosses, Personas, requests, items, dates…"
          aria-label="Search"
        />
        <div className="results">
          {q.trim().length >= 2 && results.length === 0 && <div className="empty">No matches for “{q}”.</div>}
          {q.trim().length < 2 && <div className="empty small">Type at least two characters. Try “Reaper”, “Old Document”, “Yukari”, “7/25”.</div>}
          {results.map((r, i) => (
            <a
              key={`${r.section}-${r.title}-${i}`}
              href={`#${r.to}`}
              className={`result ${i === active ? 'active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onClick={(e) => {
                e.preventDefault();
                go(r.to);
              }}
            >
              <span className="badge grey">{r.section}</span>
              <div className="result-title">{r.title}</div>
              <div className="result-sub">{r.sub}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
