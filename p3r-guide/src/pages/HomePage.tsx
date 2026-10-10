import { Link } from 'react-router-dom';
import { fullMoonBosses } from '../data/bosses';
import { walkthrough } from '../data/walkthrough';
import { requests } from '../data/requests';
import { socialLinks } from '../data/socialLinks';
import { ListLink, ListSection, ListStatic } from '../components/List';
import { guideItems, moreItems, partyItems, toolsItems } from '../lib/nav';
import { useStore } from '../lib/store';

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="home-progress" aria-hidden>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}

export function HomePage() {
  const { done } = useStore();
  const requestsDone = requests.filter((r) => done.has(`request:${r.n}`)).length;
  const slDone = socialLinks.filter((s) => done.has(`sl:${s.id}`)).length;
  const bossesDone = fullMoonBosses.filter((b) => done.has(`boss:${b.id}`)).length;

  return (
    <>
      <header className="large-title home-hero">
        <p className="eyebrow">Complete companion</p>
        <h1>Persona 3 Reload</h1>
        <p className="lede">
          A phone-style guide for one full-clear run — calendar, Tartarus, bosses, Social Links, gear, and checklists.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/walkthrough/april">
            Continue walkthrough
          </Link>
          <Link className="btn" to="/guide">
            Browse guide
          </Link>
        </div>
      </header>

      <ListSection header="Your progress" footer="Tick items off on Bosses, Social Links, and Requests. Saved on this device.">
        <ListStatic
          title="Full moon bosses"
          subtitle={`${bossesDone} of ${fullMoonBosses.length} cleared`}
          trailing={<ProgressBar value={bossesDone} max={fullMoonBosses.length} />}
        />
        <ListStatic
          title="Social Links"
          subtitle={`${slDone} of ${socialLinks.length} maxed`}
          trailing={<ProgressBar value={slDone} max={socialLinks.length} />}
        />
        <ListStatic
          title="Elizabeth requests"
          subtitle={`${requestsDone} of ${requests.length} done`}
          trailing={<ProgressBar value={requestsDone} max={requests.length} />}
        />
      </ListSection>

      <ListSection header="What's in this app" footer="Five tabs at the bottom. Guide · Party · Tools · More — each opens a short list of sections.">
        <ListLink
          item={{
            to: '/guide',
            title: 'Guide',
            subtitle: guideItems.map((i) => i.title).join(' · '),
            meta: `${walkthrough.length} months`,
          }}
        />
        <ListLink
          item={{
            to: '/party',
            title: 'Party',
            subtitle: partyItems.map((i) => i.title).join(' · '),
          }}
        />
        <ListLink
          item={{
            to: '/tools',
            title: 'Tools',
            subtitle: toolsItems.map((i) => i.title).join(' · '),
          }}
        />
        <ListLink
          item={{
            to: '/more',
            title: 'More',
            subtitle: moreItems.map((i) => i.title).join(' · '),
          }}
        />
      </ListSection>

      <ListSection header="Jump into a month">
        {walkthrough.map((m) => (
          <ListLink
            key={m.id}
            item={{
              to: `/walkthrough/${m.id}`,
              title: `${m.name} ${m.year}`,
              subtitle: m.tartarusGoal,
            }}
          />
        ))}
      </ListSection>
    </>
  );
}
