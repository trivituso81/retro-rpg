import { ListLink, ListSection } from '../components/List';
import { toolsItems } from '../lib/nav';

export function ToolsHubPage() {
  return (
    <>
      <header className="large-title">
        <h1>Tools</h1>
        <p className="lede">Lookups you open mid-run: shops, gear, Elizabeth's request list, and school answers.</p>
      </header>

      <ListSection header="Reference">
        {toolsItems.map((item) => (
          <ListLink key={item.to} item={item} />
        ))}
      </ListSection>
    </>
  );
}
