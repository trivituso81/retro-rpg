import { useState } from 'react';
import { fusionSpells, heartItems, specialFusions, recommendedPersonas, fusionTips } from '../data/personas';
import { Card, PageHeader, Badge, Anchor, filterBy } from '../components/ui';

export function PersonasPage() {
  const [q, setQ] = useState('');
  const recommended = filterBy(recommendedPersonas, q, (p) => `${p.name} ${p.arcana} ${p.note} ${p.unlock ?? ''}`);
  const hearts = filterBy(heartItems, q, (h) => `${h.persona} ${h.item} ${h.use}`);

  return (
    <>
      <PageHeader
        eyebrow="Velvet Room"
        title="Personas & Fusion"
        lede="Fusion Spells (protagonist Theurgies), special fusions, recommended Personas for each stretch of the game, Heart Items, and how fusion works in Reload."
      />

      <div className="section-tabs">
        <Anchor id="fusion-spells" className="chip">
          Fusion Spells
        </Anchor>
        <Anchor id="special" className="chip">
          Special fusions
        </Anchor>
        <Anchor id="recommended" className="chip">
          Recommended Personas
        </Anchor>
        <Anchor id="heart" className="chip">
          Heart Items
        </Anchor>
        <Anchor id="fusion-tips" className="chip">
          Fusion tips
        </Anchor>
      </div>

      <Card id="fusion-spells" title="Fusion Spells (protagonist Theurgies)">
        <p className="small muted">
          The protagonist's Theurgies are unlocked by having both listed Personas registered in the Compendium. Once unlocked they stay available regardless of your current stock.
        </p>
        <div className="grid cols-2">
          {fusionSpells.map((f) => (
            <div key={f.name} className="event" style={{ margin: 0 }}>
              <div className="card-title" style={{ marginBottom: '0.2rem' }}>
                <strong>{f.name}</strong>
                <Badge>{f.element}</Badge>
                <Badge tone="grey">{f.personas.join(' + ')}</Badge>
              </div>
              <p className="small" style={{ margin: '0 0 0.3rem' }}>
                {f.effect}
              </p>
              <p className="small muted" style={{ margin: 0 }}>
                {f.howTo}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card id="special" title="Special fusions">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Result</th>
                <th>Arcana</th>
                <th>Level</th>
                <th>Ingredients</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {specialFusions.map((s) => (
                <tr key={s.result}>
                  <td>
                    <strong>{s.result}</strong>
                  </td>
                  <td>{s.arcana}</td>
                  <td>{s.level}</td>
                  <td className="small">{s.ingredients.join(' × ')}</td>
                  <td className="small muted">{s.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="controls" style={{ marginTop: '1rem' }}>
        <input className="input" placeholder="Filter Personas / Heart Items…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card id="recommended" title="Recommended Personas">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Persona</th>
                <th>Arcana</th>
                <th>Lv</th>
                <th>Why / how</th>
              </tr>
            </thead>
            <tbody>
              {recommended.map((p) => (
                <tr key={p.name}>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.arcana}</td>
                  <td>{p.level ?? '—'}</td>
                  <td className="small">
                    {p.note}
                    {p.unlock && <div className="muted">{p.unlock}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card id="heart" title="Heart Items">
        <p className="small muted">
          A Persona hands over its Heart Item once it reaches the listed level (usually when it learns its last skill). Many are the only source of key accessories and the ultimate weapon materials.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Lv</th>
                <th>Persona</th>
                <th>Item</th>
                <th>Use</th>
              </tr>
            </thead>
            <tbody>
              {hearts.map((h) => (
                <tr key={`${h.persona}-${h.item}`}>
                  <td>{h.level}</td>
                  <td>{h.persona}</td>
                  <td>
                    <strong>{h.item}</strong>
                  </td>
                  <td className="small">{h.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card id="fusion-tips" title="Fusion tips">
        <ul style={{ margin: 0 }}>
          {fusionTips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
