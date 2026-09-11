import { useState } from 'react';
import { weapons, bodyArmor, footwear, accessories, equipmentNotes } from '../data/equipment';
import { Card, PageHeader, Badge, Chips, filterBy } from '../components/ui';

const users = Array.from(new Set(weapons.map((w) => w.user)));

export function EquipmentPage() {
  const [q, setQ] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [ultimateOnly, setUltimateOnly] = useState(false);

  let list = filterBy(weapons, q, (w) => `${w.name} ${w.type} ${w.user} ${w.effect} ${w.source}`);
  if (user) list = list.filter((w) => w.user === user);
  if (ultimateOnly) list = list.filter((w) => w.ultimate);

  const armorGroups = [
    { title: 'Body armor', rows: bodyArmor },
    { title: 'Footwear', rows: footwear },
    { title: 'Accessories', rows: accessories },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Database"
        title="Equipment"
        lede="Weapons per character (ultimate weapons flagged), notable body armor, footwear and accessories, and where each comes from — Kurosawa's shop, Tartarus chests, Heart Items or Mayoido Antiques trades."
      />

      <Card title="Weapons">
        <div className="controls">
          <input className="input" placeholder="Search weapons…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" className={`chip ${ultimateOnly ? 'active' : ''}`} onClick={() => setUltimateOnly((v) => !v)}>
            Ultimate only
          </button>
        </div>
        <div className="controls">
          <Chips options={users} value={user} onChange={setUser} allLabel="Everyone" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Weapon</th>
                <th>User</th>
                <th>Type</th>
                <th>Atk</th>
                <th>Acc</th>
                <th>Effect</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {list.map((w) => (
                <tr key={`${w.user}-${w.name}`}>
                  <td>
                    <strong>{w.name}</strong> {w.ultimate && <Badge tone="gold">Ultimate</Badge>}
                  </td>
                  <td>{w.user}</td>
                  <td className="small">{w.type}</td>
                  <td>{w.attack || '—'}</td>
                  <td>{w.accuracy || '—'}</td>
                  <td className="small">{w.effect}</td>
                  <td className="small muted">{w.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div id="armor" />
      {armorGroups.map((g) => (
        <Card key={g.title} title={g.title}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  {g.rows.some((r) => r.defense !== undefined) && <th>Def</th>}
                  <th>Effect</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <strong>{a.name}</strong>
                    </td>
                    {g.rows.some((r) => r.defense !== undefined) && <td>{a.defense ?? '—'}</td>}
                    <td className="small">{a.effect}</td>
                    <td className="small muted">{a.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}

      <Card title="Equipment notes">
        <ul style={{ margin: 0 }}>
          {equipmentNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
