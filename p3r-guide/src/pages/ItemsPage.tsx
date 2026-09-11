import { useState } from 'react';
import { items, shops } from '../data/items';
import type { Item } from '../data/types';
import { Card, PageHeader, Chips, Anchor, filterBy } from '../components/ui';

const categories = Array.from(new Set(items.map((i) => i.category))) as Item['category'][];

export function ItemsPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Item['category'] | null>(null);

  let list = filterBy(items, q, (i) => `${i.name} ${i.category} ${i.effect} ${i.source}`);
  if (cat) list = list.filter((i) => i.category === cat);

  return (
    <>
      <PageHeader
        eyebrow="Database"
        title="Items & Shops"
        lede="Consumables, materials and key items with where to get them, plus every shop, sale day and the Tanaka's Amazing Commodities broadcast schedule."
      />

      <div className="section-tabs">
        <Anchor id="items" className="chip">
          Items
        </Anchor>
        <Anchor id="shops" className="chip">
          Shops & services
        </Anchor>
      </div>

      <Card id="items" title="Items">
        <div className="controls">
          <input className="input" placeholder="Search items…" value={q} onChange={(e) => setQ(e.target.value)} />
          <span className="small muted">{list.length} shown</span>
        </div>
        <div className="controls">
          <Chips options={categories} value={cat} onChange={setCat} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Effect</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.name}>
                  <td>
                    <strong>{i.name}</strong>
                  </td>
                  <td className="small">{i.category}</td>
                  <td className="small">{i.effect}</td>
                  <td className="small muted">{i.source}</td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty">
                    No items match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 id="shops" style={{ margin: '1.4rem 0 0.8rem' }}>
        Shops & services
      </h2>
      <div className="grid cols-2">
        {shops.map((s) => (
          <Card key={s.name} title={s.name}>
            <dl className="stat-row" style={{ marginBottom: '0.6rem' }}>
              <dt>Location</dt>
              <dd>{s.location}</dd>
              <dt>Hours</dt>
              <dd>{s.hours}</dd>
              <dt>Sells</dt>
              <dd className="small">{s.sells}</dd>
            </dl>
            <p className="small" style={{ margin: 0 }}>
              <strong>Tip:</strong> {s.tip}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
