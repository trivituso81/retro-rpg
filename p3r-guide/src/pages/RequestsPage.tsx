import { useState } from 'react';
import { requests, requestNotes } from '../data/requests';
import { Card, PageHeader, Badge, filterBy } from '../components/ui';
import { useStore } from '../lib/store';

type Filter = 'all' | 'open' | 'done' | 'missable';

export function RequestsPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const { done, toggleDone, clearDone } = useStore();

  const doneCount = requests.filter((r) => done.has(`request:${r.n}`)).length;
  let list = filterBy(requests, q, (r) => `${r.n} ${r.title} ${r.task} ${r.solution} ${r.reward} ${r.unlock ?? ''}`);
  if (filter === 'open') list = list.filter((r) => !done.has(`request:${r.n}`));
  if (filter === 'done') list = list.filter((r) => done.has(`request:${r.n}`));
  if (filter === 'missable') list = list.filter((r) => r.missable);

  return (
    <>
      <PageHeader
        eyebrow="Velvet Room"
        title="Elizabeth's Requests"
        lede="All 101 requests with how to solve them, rewards, deadlines and unlock conditions. Tick them off as you go — progress is saved in this browser."
      />

      <Card>
        <div className="controls">
          <span className="small muted">
            {doneCount} / {requests.length} completed
          </span>
          <div className="progress">
            <div style={{ width: `${(doneCount / requests.length) * 100}%` }} />
          </div>
          <button type="button" className="chip" onClick={() => clearDone('request:')}>
            Reset
          </button>
        </div>
        <div className="controls">
          <input className="input" placeholder="Search requests…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="chip-row">
            {(['all', 'open', 'done', 'missable'] as Filter[]).map((f) => (
              <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'open' ? 'Open' : f === 'done' ? 'Done' : 'Missable'}
              </button>
            ))}
          </div>
        </div>
        <ul className="small muted" style={{ margin: 0 }}>
          {requestNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Card>

      <div className="table-wrap" style={{ marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Done</th>
              <th>#</th>
              <th>Request</th>
              <th>Solution</th>
              <th>Reward</th>
              <th>Unlock / deadline</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const key = `request:${r.n}`;
              const isDone = done.has(key);
              return (
                <tr key={r.n} className={isDone ? 'done' : ''}>
                  <td>
                    <input type="checkbox" checked={isDone} onChange={() => toggleDone(key)} aria-label={`Mark request ${r.n} done`} />
                  </td>
                  <td>{r.n}</td>
                  <td>
                    <strong style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--muted)' : undefined }}>{r.title}</strong>
                    <div className="small muted">{r.task}</div>
                  </td>
                  <td className="small">{r.solution}</td>
                  <td className="small">{r.reward}</td>
                  <td className="small">
                    {r.unlock && <div className="muted">{r.unlock}</div>}
                    {r.deadline && <Badge tone="red">Deadline {r.deadline}</Badge>}
                    {r.missable && !r.deadline && <Badge tone="gold">Missable</Badge>}
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">
                  No requests match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
