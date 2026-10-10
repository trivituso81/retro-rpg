import { ListLink, ListSection } from '../components/List';
import { partyItems } from '../lib/nav';

export function PartyHubPage() {
  return (
    <>
      <header className="large-title">
        <h1>Party</h1>
        <p className="lede">People, relationships, and Personas — everything that grows with SEES outside Tartarus.</p>
      </header>

      <ListSection header="Relationships & fusion">
        {partyItems.map((item) => (
          <ListLink key={item.to} item={item} />
        ))}
      </ListSection>
    </>
  );
}
