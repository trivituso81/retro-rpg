import { useState } from 'react';
import { secrets } from '../data/secrets';
import type { Secret } from '../data/types';
import { Card, PageHeader, Badge, Chips, Spoiler } from '../components/ui';
import { useStore } from '../lib/store';

const categories = Array.from(new Set(secrets.map((s) => s.category))) as Secret['category'][];

export function SecretsPage() {
  const [cat, setCat] = useState<Secret['category'] | null>(null);
  const { spoilers, setSpoilers } = useStore();
  const list = cat ? secrets.filter((s) => s.category === cat) : secrets;

  return (
    <>
      <PageHeader
        eyebrow="Hidden content"
        title="Secrets"
        lede="Superbosses, hidden fights, story-changing choices, fusion unlocks and what carries into New Game+. Entries marked as spoilers stay blurred until you reveal them or turn spoilers on."
      />
      <div className="controls">
        <Chips options={categories} value={cat} onChange={setCat} />
        <button type="button" className={`chip ${spoilers ? 'active' : ''}`} style={{ marginLeft: 'auto' }} onClick={() => setSpoilers(!spoilers)}>
          {spoilers ? 'Hide spoilers' : 'Show all spoilers'}
        </button>
      </div>
      {list.map((s) => {
        const body = s.body.map((p, i) => (
          <p key={i} style={{ marginBottom: i === s.body.length - 1 ? 0 : undefined }}>
            {p}
          </p>
        ));
        return (
          <Card
            key={s.id}
            id={s.id}
            title={s.title}
            badges={
              <>
                <Badge>{s.category}</Badge>
                {s.spoiler && <Badge tone="red">Story spoiler</Badge>}
              </>
            }
          >
            {s.spoiler ? <Spoiler label="Story spoiler">{body}</Spoiler> : body}
          </Card>
        );
      })}
    </>
  );
}
