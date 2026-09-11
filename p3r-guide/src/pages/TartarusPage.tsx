import { Link } from 'react-router-dom';
import { tartarusBlocks, monadPassages, tartarusBasics } from '../data/tartarus';
import { missingPersons } from '../data/items';
import { Card, PageHeader, Badge, Anchor } from '../components/ui';

export function TartarusPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dungeon"
        title="Tartarus"
        lede="The tower that appears during the Dark Hour. Six blocks, 264 floors, guardian floors with fixed bosses, barrier floors that open after each full moon, and hidden Monad Passages."
      />

      <div className="section-tabs">
        {tartarusBlocks.map((b) => (
          <Anchor key={b.id} id={b.id} className="chip">
            {b.name} ({b.floors[0]}–{b.floors[1]})
          </Anchor>
        ))}
        <Anchor id="monad" className="chip">
          Monad Passages
        </Anchor>
        <Anchor id="missing" className="chip">
          Missing persons
        </Anchor>
        <Anchor id="basics" className="chip">
          Basics
        </Anchor>
      </div>

      <div className="grid cols-2" style={{ marginBottom: '1rem' }}>
        {tartarusBlocks.map((b) => (
          <Card
            key={b.id}
            id={b.id}
            title={
              <>
                {b.name} <span className="muted small">— {b.subtitle}</span>
              </>
            }
            badges={
              <>
                <Badge>
                  {b.floors[0]}F – {b.floors[1]}F
                </Badge>
                {b.barrier && <Badge tone="gold">Barrier {b.barrier}F</Badge>}
              </>
            }
          >
            <p className="small">
              <strong>Unlocks:</strong> {b.unlocks}
            </p>
            <h3>Guardians</h3>
            <div className="table-wrap" style={{ marginBottom: '0.8rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>Floor</th>
                    <th>Guardian</th>
                    <th>Lv</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {b.guardians.map((g) => (
                    <tr key={g.floor}>
                      <td>{g.floor}F</td>
                      <td>{g.name}</td>
                      <td>{g.level}</td>
                      <td className="muted">{g.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {b.oldDocuments && b.oldDocuments.length > 0 && (
              <p className="small">
                <strong>Old Documents:</strong>{' '}
                {b.oldDocuments.map((d) => `${d.floor}F — ${d.doc}`).join('; ')} (<Link to="/requests">Requests</Link>)
              </p>
            )}
            {b.monadPassage && (
              <p className="small">
                <strong>Monad Passage:</strong> <Anchor id="monad">{b.monadPassage}F</Anchor>
              </p>
            )}
            <ul className="small" style={{ margin: 0 }}>
              {b.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card id="monad" title="Monad Passages" badges={<Badge tone="red">Optional · hard</Badge>}>
        <p className="small muted">
          Hidden gauntlet rooms on specific floors. Each opens when you approach carrying the right Major Arcana card from that block's Shuffle Times. Clearing them is required for Requests #37 and #99 and unlocks the final door for Request #101.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Floor</th>
                <th>Block</th>
                <th>Enemies</th>
                <th>Reward</th>
                <th>Strategy</th>
              </tr>
            </thead>
            <tbody>
              {monadPassages.map((m) => (
                <tr key={m.floor}>
                  <td>
                    <strong>{m.floor}F</strong>
                    <div className="small muted">{m.cardRequired}</div>
                  </td>
                  <td>{m.block}</td>
                  <td>
                    <ul className="small" style={{ margin: 0, paddingLeft: '1rem' }}>
                      {m.enemies.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{m.reward}</td>
                  <td className="small">{m.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card id="missing" title="Missing persons" badges={<Badge tone="gold">Rewards from Officer Kurosawa</Badge>}>
        <p className="small muted">
          Before most full moons, people are lost inside Tartarus. Fuuka gives the floor range; find them before the deadline. Failing Bunkichi locks the Hierophant link, failing Maiko locks the Hanged Man link, and Ayako is needed for Request #97.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Missing from</th>
                <th>Deadline</th>
                <th>Name</th>
                <th>Reward</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {missingPersons.map((p) => (
                <tr key={p.name}>
                  <td>{p.missing}</td>
                  <td>{p.limit}</td>
                  <td>{p.name}</td>
                  <td>{p.reward}</td>
                  <td className="small muted">{p.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card id="basics" title="How Tartarus works">
        <div className="grid cols-2">
          {tartarusBasics.map((b) => (
            <div key={b.title}>
              <h3>{b.title}</h3>
              <p className="small muted" style={{ margin: 0 }}>
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
