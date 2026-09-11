import { linkedEpisodes } from '../data/socialLinks';
import { Card, PageHeader, Badge, Checklist } from '../components/ui';

export function LinkedEpisodesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bonds"
        title="Linked Episodes"
        lede="Reload replaces Social Links for the male party members (and Ryoji) with Linked Episodes: hangouts on set date windows that grant stat bonuses, Characteristics and finally a key item that unlocks a special Persona. Each window is strict — answer the invitation the day it appears."
      />
      <div className="grid cols-2">
        {linkedEpisodes.map((l) => (
          <Card
            key={l.character}
            title={l.character}
            badges={
              <>
                <Badge tone="gold">{l.persona}</Badge>
                {l.charge && <Badge tone="grey">{l.charge}</Badge>}
              </>
            }
          >
            <p className="small muted">
              <strong>Final reward:</strong> {l.keyItem}
            </p>
            <Checklist
              prefix={`le:${l.character}`}
              items={l.episodes.map((e) => ({
                id: String(e.n),
                title: (
                  <>
                    {e.n > 0 ? `Episode ${e.n}` : 'Optional step'} <span className="muted">— {e.window}</span>
                  </>
                ),
                detail: (
                  <>
                    {e.where} · {e.reward}
                    {e.note ? ` · ${e.note}` : ''}
                  </>
                ),
              }))}
            />
          </Card>
        ))}
      </div>
    </>
  );
}
