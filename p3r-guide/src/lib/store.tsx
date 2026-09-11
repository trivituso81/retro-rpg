import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const SPOILER_KEY = 'p3r-guide:spoilers';
const PROGRESS_KEY = 'p3r-guide:progress';

interface Store {
  spoilers: boolean;
  setSpoilers: (v: boolean) => void;
  done: Set<string>;
  toggleDone: (id: string) => void;
  clearDone: (prefix?: string) => void;
}

const StoreContext = createContext<Store | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [spoilers, setSpoilersState] = useState<boolean>(() => readJson(SPOILER_KEY, false));
  const [done, setDone] = useState<Set<string>>(() => new Set(readJson<string[]>(PROGRESS_KEY, [])));

  useEffect(() => {
    localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilers));
  }, [spoilers]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done]));
  }, [done]);

  const setSpoilers = useCallback((v: boolean) => setSpoilersState(v), []);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearDone = useCallback((prefix?: string) => {
    setDone((prev) => {
      if (!prefix) return new Set();
      return new Set([...prev].filter((id) => !id.startsWith(prefix)));
    });
  }, []);

  const value = useMemo(
    () => ({ spoilers, setSpoilers, done, toggleDone, clearDone }),
    [spoilers, setSpoilers, done, toggleDone, clearDone],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
