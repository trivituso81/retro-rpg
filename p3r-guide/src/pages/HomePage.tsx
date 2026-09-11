import { Link } from 'react-router-dom';
import { fullMoonBosses } from '../data/bosses';
import { walkthrough } from '../data/walkthrough';
import { requests } from '../data/requests';
import { socialLinks } from '../data/socialLinks';
import { Card, Badge } from '../components/ui';
import { useStore } from '../lib/store';

const sections = [
  { to: '/walkthrough', title: 'Walkthrough', text: 'Month-by-month calendar: story beats, deadlines, exams, Tartarus goals and Social Link focus.' },
  { to: '/tartarus', title: 'Tartarus', text: 'All six blocks, barrier floors, guardians, Old Document floors, Monad Passages and missing persons.' },
  { to: '/bosses', title: 'Full Moon Bosses', text: 'Affinities, phases and step-by-step strategies for the twelve Arcana Shadows and the finale.' },
  { to: '/characters', title: 'Characters', text: 'Party members, Personas, Theurgies, affinities and build tips, plus the supporting cast.' },
  { to: '/social-links', title: 'Social Links', text: 'All 22 Arcana: start dates, requirements, schedules, ultimate Personas and romance notes.' },
  { to: '/linked-episodes', title: 'Linked Episodes', text: 'Windows and rewards for Junpei, Akihiko, Koromaru, Ken, Shinjiro and Ryoji.' },
  { to: '/personas', title: 'Personas & Fusion', text: 'Fusion Spells, special fusions, Heart Items and recommended Personas per phase.' },
  { to: '/items', title: 'Items & Shops', text: 'Consumables, materials, key items, every shop and sale day, and Tanaka\'s broadcast schedule.' },
  { to: '/equipment', title: 'Equipment', text: 'Weapons per character (including ultimates), armor, footwear and accessories worth owning.' },
  { to: '/requests', title: 'Elizabeth Requests', text: 'All 101 requests with solutions, rewards, deadlines and a checklist saved in your browser.' },
  { to: '/school', title: 'Class & Exam Answers', text: 'Every classroom question and exam answer in order.' },
  { to: '/tips', title: 'Tips & Strategy', text: 'Combat, calendar planning, stats, money and quality-of-life advice.' },
  { to: '/secrets', title: 'Secrets', text: 'Reaper, Elizabeth, hidden fights, story-changing choices and New Game+.' },
];

export function HomePage() {
  const { done } = useStore();
  const requestsDone = requests.filter((r) => done.has(`request:${r.n}`)).length;
  const slDone = socialLinks.filter((s) => done.has(`sl:${s.id}`)).length;
  const bossesDone = fullMoonBosses.filter((b) => done.has(`boss:${b.id}`)).length;

  return (
    <>
      <section className="hero">
        <div className="eyebrow" style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
          Unofficial complete guide
        </div>
        <h1>Persona 3 Reload</h1>
        <p className="lede">
          Everything you need for a single full-clear run of Persona 3 Reload: the calendar, Tartarus, every boss, all 22 Social Links, Personas, items,
          equipment, Elizabeth's 101 requests, class answers, tips and secrets. Story spoilers are hidden until you turn them on.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/walkthrough/april">
            Start the walkthrough
          </Link>
          <Link className="btn" to="/requests">
            Request checklist
          </Link>
          <Link className="btn" to="/tips">
            Beginner tips
          </Link>
        </div>
      </section>

      <div className="grid cols-3" style={{ marginBottom: '1.6rem' }}>
        <Card title="Your progress">
          <dl className="stat-row">
            <dt>Full moons</dt>
            <dd>
              {bossesDone} / {fullMoonBosses.length}
            </dd>
            <dt>Social Links</dt>
            <dd>
              {slDone} / {socialLinks.length}
            </dd>
            <dt>Requests</dt>
            <dd>
              {requestsDone} / {requests.length}
            </dd>
          </dl>
          <p className="small muted" style={{ marginTop: '0.6rem' }}>Tick items off on the Bosses, Social Links and Requests pages; progress is stored locally.</p>
        </Card>
        <Card title="The year at a glance">
          <ul className="small" style={{ margin: 0 }}>
            {walkthrough.map((m) => (
              <li key={m.id}>
                <Link to={`/walkthrough/${m.id}`}>
                  {m.name} {m.year}
                </Link>{' '}
                <span className="muted">— {m.tartarusGoal}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Key rules of thumb">
          <ul className="small" style={{ margin: 0 }}>
            <li>Hit weaknesses, Shift, All-Out Attack. Theurgy for bosses.</li>
            <li>Clear each new Tartarus block in one or two nights, then live your life.</li>
            <li>Buy the Security Site Note (7/9) and Ambush everything.</li>
            <li>Stat deadlines: Courage 6 by 6/19, Charm 6 by 7/25, Academics 6 by 11/21.</li>
            <li>Never leave Light/Dark instant-kills uncovered on the protagonist.</li>
          </ul>
        </Card>
      </div>

      <h2 style={{ marginBottom: '0.8rem' }}>Sections</h2>
      <div className="grid cols-3">
        {sections.map((s) => (
          <Link key={s.to} to={s.to} className="tile">
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Link>
        ))}
      </div>

      <Card title="Full moon calendar">
        <div className="table-wrap" style={{ border: 'none', background: 'transparent' }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Arcana</th>
                <th>Operation</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {fullMoonBosses.map((b) => (
                <tr key={b.id}>
                  <td>
                    {b.date} <span className="muted">{b.weekday}</span>
                  </td>
                  <td>
                    <Badge tone="gold">{b.arcana}</Badge>
                  </td>
                  <td>
                    <Link to={`/bosses#${b.id}`}>{b.name}</Link> <span className="muted small">— {b.location}</span>
                  </td>
                  <td>Lv {b.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
