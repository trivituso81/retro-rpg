import { useState } from 'react';
import { socialLinks, socialStats } from '../data/socialLinks';
import { Card, PageHeader, Badge, filterBy } from '../components/ui';
import { useStore } from '../lib/store';

export function SocialLinksPage() {
  const [q, setQ] = useState('');
  const [romanceOnly, setRomanceOnly] = useState(false);
  const { done, toggleDone } = useStore();

  let list = filterBy(socialLinks, q, (s) => `${s.arcana} ${s.name} ${s.title} ${s.location} ${s.days} ${s.ultimatePersona}`);
  if (romanceOnly) list = list.filter((s) => s.romance);
  const maxed = socialLinks.filter((s) => done.has(`sl:${s.id}`)).length;

  return (
    <>
      <PageHeader
        eyebrow="Bonds"
        title="Social Links"
        lede="All 22 Arcana. Maxing a link unlocks that Arcana's ultimate Persona for fusion and grants a memento; maxing all 22 unlocks Orpheus Telos. Reload has no reversed links, so schedule freely."
      />

      <div className="controls">
        <input className="input" placeholder="Filter by name, arcana, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className={`chip ${romanceOnly ? 'active' : ''}`} onClick={() => setRomanceOnly((v) => !v)}>
          Romance options
        </button>
        <span className="small muted" style={{ marginLeft: 'auto' }}>
          {maxed} / {socialLinks.length} maxed
        </span>
      </div>

      <div className="table-wrap" style={{ marginBottom: '1.2rem' }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Arcana</th>
              <th>Character</th>
              <th>Starts</th>
              <th>Days</th>
              <th>Ultimate Persona</th>
              <th>Maxed</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>{s.number}</td>
                <td>
                  <a href={`#${s.id}`}>{s.arcana}</a>
                </td>
                <td>
                  {s.name} {s.romance && <Badge tone="red">Romance</Badge>}
                </td>
                <td>{s.startDate}</td>
                <td className="small">{s.days}</td>
                <td>{s.ultimatePersona}</td>
                <td>
                  <input type="checkbox" checked={done.has(`sl:${s.id}`)} onChange={() => toggleDone(`sl:${s.id}`)} aria-label={`Mark ${s.arcana} maxed`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {list.map((s) => (
        <Card
          key={s.id}
          id={s.id}
          title={
            <>
              {s.number}. {s.arcana} <span className="muted small">— {s.name}</span>
            </>
          }
          badges={
            <>
              <Badge tone="grey">{s.title}</Badge>
              {s.romance && <Badge tone="red">Romance</Badge>}
              {s.missable && <Badge tone="gold">Missable</Badge>}
            </>
          }
        >
          <p>{s.description}</p>
          <dl className="stat-row" style={{ marginBottom: '0.8rem' }}>
            <dt>Starts</dt>
            <dd>{s.startDate}</dd>
            <dt>Requirements</dt>
            <dd>{s.prerequisites}</dd>
            <dt>Available</dt>
            <dd>{s.days}</dd>
            <dt>Location</dt>
            <dd>{s.location}</dd>
            <dt>Ultimate Persona</dt>
            <dd>{s.ultimatePersona}</dd>
            <dt>Memento</dt>
            <dd>{s.memento}</dd>
            {s.missable && (
              <>
                <dt>Missable</dt>
                <dd>{s.missable}</dd>
              </>
            )}
          </dl>
          <h3>Tips</h3>
          <ul style={{ margin: 0 }}>
            {s.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      ))}

      <Card id="stats" title="Social Stats">
        <div className="grid cols-3">
          {socialStats.map((st) => (
            <div key={st.stat}>
              <h3>{st.stat}</h3>
              <p className="small muted">Ranks: {st.ranks.join(' → ')}</p>
              <ul className="small">
                {st.sources.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              <p className="small">
                <strong>Needed:</strong> {st.needed}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
