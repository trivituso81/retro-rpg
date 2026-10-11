import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { walkthrough } from '../data/walkthrough';
import type { WalkthroughEvent } from '../data/types';
import { Card, PageHeader, Spoiler, Chips } from '../components/ui';
import { ListLink, ListSection } from '../components/List';
import { useStore } from '../lib/store';

const kinds: WalkthroughEvent['kind'][] = ['story', 'fullmoon', 'deadline', 'social', 'linked', 'exam', 'tartarus', 'tip'];
const kindLabel: Record<WalkthroughEvent['kind'], string> = {
  story: 'Story',
  fullmoon: 'Full Moon',
  deadline: 'Deadline',
  social: 'Social Link',
  linked: 'Linked Episode',
  exam: 'Exam',
  tartarus: 'Tartarus',
  tip: 'Tip',
};

function MonthIndex() {
  return (
    <>
      <header className="large-title">
        <h1>Walkthrough</h1>
        <p className="lede">Pick a month. Each page covers objectives, Tartarus goals, Social Link focus, and the day-by-day calendar.</p>
      </header>
      <ListSection header="The school year">
        {walkthrough.map((m) => (
          <ListLink
            key={m.id}
            item={{
              to: `/walkthrough/${m.id}`,
              title: `${m.name} ${m.year}`,
              subtitle: m.summary,
              meta: `${m.events.length} events`,
            }}
          />
        ))}
      </ListSection>
    </>
  );
}

export function WalkthroughPage() {
  const { month } = useParams();
  const { spoilers } = useStore();
  const [kind, setKind] = useState<WalkthroughEvent['kind'] | null>(null);

  if (!month) return <MonthIndex />;
  const data = walkthrough.find((m) => m.id === month);
  if (!data) return <Navigate to="/walkthrough" replace />;

  const idx = walkthrough.indexOf(data);
  const prev = walkthrough[idx - 1];
  const next = walkthrough[idx + 1];
  const events = data.events.filter((e) => (kind ? e.kind === kind : true));

  return (
    <>
      <PageHeader eyebrow="Walkthrough" title={`${data.name} ${data.year}`} lede={data.summary} />

      <div className="month-tabs" role="navigation" aria-label="Months">
        {walkthrough.map((m) => (
          <Link key={m.id} to={`/walkthrough/${m.id}`} className={`chip ${m.id === data.id ? 'active' : ''}`}>
            {m.name.slice(0, 3)}
          </Link>
        ))}
      </div>

      <div className="two-col" style={{ marginBottom: '1rem' }}>
        <Card title="Objectives this month">
          <ul style={{ margin: 0 }}>
            {data.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        </Card>
        <div>
          <Card title="Tartarus goal">
            <p style={{ margin: 0 }}>{data.tartarusGoal}</p>
          </Card>
          <Card title="Social Link focus">
            <ul style={{ margin: 0 }}>
              {data.socialFocus.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card title="Calendar">
        <div className="controls">
          <Chips options={kinds} value={kind} onChange={setKind} label={(k) => kindLabel[k]} />
        </div>
        <div className="timeline">
          {events.map((e, i) => {
            const body = (
              <>
                <div className="event-head">
                  <span className="event-date">{e.date}</span>
                  <strong>{e.title}</strong>
                  <span className={`badge kind-${e.kind}`}>{kindLabel[e.kind]}</span>
                </div>
                <p className="event-detail">{e.detail}</p>
              </>
            );
            return (
              <div key={`${e.date}-${i}`} className={`event kind-${e.kind}`}>
                {e.spoiler && !spoilers ? <Spoiler>{body}</Spoiler> : body}
              </div>
            );
          })}
          {events.length === 0 && <div className="empty">No events of this type in {data.name}.</div>}
        </div>
      </Card>

      <div className="controls" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
        {prev ? (
          <Link className="btn" to={`/walkthrough/${prev.id}`}>
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn primary" to={`/walkthrough/${next.id}`}>
            {next.name} →
          </Link>
        ) : (
          <Link className="btn primary" to="/secrets">
            Post-game & secrets →
          </Link>
        )}
      </div>
    </>
  );
}
