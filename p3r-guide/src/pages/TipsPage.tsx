import { useState } from 'react';
import { tips } from '../data/tips';
import type { Tip } from '../data/types';
import { Card, PageHeader, Badge, Chips } from '../components/ui';

const categories = Array.from(new Set(tips.map((t) => t.category))) as Tip['category'][];

export function TipsPage() {
  const [cat, setCat] = useState<Tip['category'] | null>(null);
  const list = cat ? tips.filter((t) => t.category === cat) : tips;

  return (
    <>
      <PageHeader eyebrow="Strategy" title="Tips & Strategy" lede="How to fight, how to spend your days, and how to stop wasting yen and SP." />
      <div className="controls">
        <Chips options={categories} value={cat} onChange={setCat} />
      </div>
      {list.map((t) => (
        <Card key={t.id} id={t.id} title={t.title} badges={<Badge>{t.category}</Badge>}>
          {t.body.map((p, i) => (
            <p key={i} style={{ marginBottom: i === t.body.length - 1 ? 0 : undefined }}>
              {p}
            </p>
          ))}
        </Card>
      ))}
    </>
  );
}
