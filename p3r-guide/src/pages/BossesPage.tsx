import { fullMoonBosses } from '../data/bosses';
import { Card, PageHeader, Badge, Affinities, Spoiler } from '../components/ui';
import { useStore } from '../lib/store';

export function BossesPage() {
  const { done, toggleDone } = useStore();

  return (
    <>
      <PageHeader
        eyebrow="Boss guide"
        title="Full Moon Operations"
        lede="Each full moon SEES hunts a greater Shadow named after a Major Arcana. Levels are the recommended party level; affinities are for the boss itself unless noted."
      />

      <div className="section-tabs">
        {fullMoonBosses.map((b) => (
          <a key={b.id} href={`#${b.id}`} className={`chip ${done.has(`boss:${b.id}`) ? 'active' : ''}`}>
            {b.date} {b.arcana}
          </a>
        ))}
      </div>

      {fullMoonBosses.map((b) => {
        const key = `boss:${b.id}`;
        return (
          <Card
            key={b.id}
            id={b.id}
            title={b.name}
            badges={
              <>
                <Badge tone="gold">{b.arcana}</Badge>
                <Badge>
                  {b.date} · {b.weekday}
                </Badge>
                <Badge tone="grey">Lv {b.level}</Badge>
                <label className="check small" style={{ marginLeft: 'auto' }}>
                  <input type="checkbox" checked={done.has(key)} onChange={() => toggleDone(key)} /> Defeated
                </label>
              </>
            }
          >
            <p className="small muted">
              <strong>Location:</strong> {b.location}
            </p>
            <div style={{ marginBottom: '0.6rem' }}>
              <Affinities map={b.affinities} noWeakness={b.noWeakness} />
            </div>
            <p>{b.summary}</p>
            <h3>Strategy</h3>
            <ol style={{ marginBottom: b.reward || b.spoiler ? '0.75rem' : 0 }}>
              {b.strategy.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            {b.reward && (
              <p className="small">
                <strong>Reward:</strong> {b.reward}
              </p>
            )}
            {b.spoiler && (
              <Spoiler label="Story spoiler">
                <p className="small" style={{ margin: 0 }}>
                  {b.spoiler}
                </p>
              </Spoiler>
            )}
          </Card>
        );
      })}
    </>
  );
}
