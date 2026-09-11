import { Link, Navigate, useParams } from 'react-router-dom';
import { characters, npcs } from '../data/characters';
import { Card, PageHeader, Badge, Spoiler } from '../components/ui';

export function CharactersPage() {
  const groups = Array.from(new Set(npcs.map((n) => n.group)));
  return (
    <>
      <PageHeader eyebrow="Party" title="Characters" lede="The Specialized Extracurricular Execution Squad and the people around them." />
      <h2 style={{ marginBottom: '0.8rem' }}>S.E.E.S.</h2>
      <div className="grid cols-3" style={{ marginBottom: '1.5rem' }}>
        {characters.map((c) => (
          <Link key={c.id} to={`/characters/${c.id}`} className="tile">
            <div className="card-title" style={{ marginBottom: '0.3rem' }}>
              <h3 style={{ margin: 0 }}>{c.name}</h3>
              <Badge tone="gold">{c.arcana}</Badge>
            </div>
            <p>
              {c.role} · {c.persona}
              {c.evolvedPersona ? ` → ${c.evolvedPersona}` : ''}
            </p>
            <p style={{ marginTop: '0.4rem' }}>
              <span className="badge grey">{c.weapon}</span> <span className="badge grey">{c.element}</span>
            </p>
            <p style={{ marginTop: '0.4rem' }}>Joins: {c.joins}</p>
          </Link>
        ))}
      </div>

      <h2 id="npcs" style={{ marginBottom: '0.8rem' }}>
        Supporting cast
      </h2>
      {groups.map((g) => (
        <Card key={g} title={g}>
          <div className="grid cols-2">
            {npcs
              .filter((n) => n.group === g)
              .map((n) => (
                <div key={n.id}>
                  <h3>{n.name}</h3>
                  <p className="small">{n.description}</p>
                  {n.spoiler && (
                    <Spoiler>
                      <p className="small" style={{ margin: 0 }}>
                        {n.spoiler}
                      </p>
                    </Spoiler>
                  )}
                </div>
              ))}
          </div>
        </Card>
      ))}
    </>
  );
}

export function CharacterDetailPage() {
  const { id } = useParams();
  const c = characters.find((x) => x.id === id);
  if (!c) return <Navigate to="/characters" replace />;
  const idx = characters.indexOf(c);
  const prev = characters[idx - 1];
  const next = characters[idx + 1];

  return (
    <>
      <PageHeader eyebrow={`${c.arcana} · ${c.role}`} title={c.name + (c.jpName ? ` (${c.jpName})` : '')} lede={c.bio} />

      <div className="two-col" style={{ marginBottom: '1rem' }}>
        <Card title="Profile">
          <dl className="stat-row">
            <dt>Persona</dt>
            <dd>
              {c.persona}
              {c.evolvedPersona && (
                <>
                  {' '}
                  → <strong>{c.evolvedPersona}</strong>
                </>
              )}
            </dd>
            {c.evolutionNote && (
              <>
                <dt>Evolution</dt>
                <dd>{c.evolutionNote}</dd>
              </>
            )}
            <dt>Weapon</dt>
            <dd>{c.weapon}</dd>
            <dt>Element</dt>
            <dd>{c.element}</dd>
            <dt>Affinities</dt>
            <dd>{c.affinities}</dd>
            <dt>Joins</dt>
            <dd>{c.joins}</dd>
            <dt>Theurgy charge</dt>
            <dd>{c.theurgyCharge}</dd>
          </dl>
        </Card>
        <Card title="Theurgies">
          <div className="detail-list">
            {c.theurgies.map((t) => (
              <div key={t.name}>
                <div className="card-title" style={{ marginBottom: '0.15rem' }}>
                  <strong>{t.name}</strong>
                  <Badge tone="grey">{t.persona}</Badge>
                  <Badge>{t.element}</Badge>
                </div>
                <p className="small muted" style={{ margin: 0 }}>
                  {t.effect}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="two-col" style={{ marginBottom: '1rem' }}>
        <Card title="Strengths">
          <ul style={{ margin: 0 }}>
            {c.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card title="Weaknesses">
          <ul style={{ margin: 0 }}>
            {c.weaknesses.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="How to use">
        <ul style={{ margin: 0 }}>
          {c.tips.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Card>

      {c.spoilerBio && (
        <Card title="Story">
          <Spoiler label="Major story spoiler">
            <p style={{ margin: 0 }}>{c.spoilerBio}</p>
          </Spoiler>
        </Card>
      )}

      <div className="controls" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
        {prev ? (
          <Link className="btn" to={`/characters/${prev.id}`}>
            ← {prev.name}
          </Link>
        ) : (
          <Link className="btn" to="/characters">
            ← All characters
          </Link>
        )}
        {next && (
          <Link className="btn primary" to={`/characters/${next.id}`}>
            {next.name} →
          </Link>
        )}
      </div>
    </>
  );
}
