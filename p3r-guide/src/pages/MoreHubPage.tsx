import { ListButton, ListLink, ListSection, ListStatic } from '../components/List';
import { moreItems } from '../lib/nav';
import { useStore } from '../lib/store';

export function MoreHubPage() {
  const { spoilers, setSpoilers, clearDone, done } = useStore();

  return (
    <>
      <header className="large-title">
        <h1>More</h1>
        <p className="lede">Strategy extras, spoilers, and settings saved in this browser.</p>
      </header>

      <ListSection header="Extras">
        {moreItems.map((item) => (
          <ListLink key={item.to} item={item} />
        ))}
      </ListSection>

      <ListSection header="Settings">
        <ListButton
          title="Story spoilers"
          subtitle={spoilers ? 'Currently shown across the guide' : 'Hidden until you reveal them'}
          meta={spoilers ? 'On' : 'Off'}
          onClick={() => setSpoilers(!spoilers)}
          trailing={<span className={`ios-switch ${spoilers ? 'on' : ''}`} aria-hidden />}
        />
        <ListStatic title="Saved checklists" subtitle={`${done.size} items marked done`} />
        <ListButton
          title="Clear all progress"
          subtitle="Unchecks bosses, Social Links, requests, and Linked Episodes"
          danger
          onClick={() => {
            if (window.confirm('Clear all saved checklist progress on this device?')) clearDone();
          }}
        />
      </ListSection>

      <ListSection footer="Unofficial fan guide. Persona 3 Reload © ATLUS / SEGA.">
        <ListStatic title="About" subtitle="Built as a phone-first companion for a full-clear run." />
      </ListSection>
    </>
  );
}
