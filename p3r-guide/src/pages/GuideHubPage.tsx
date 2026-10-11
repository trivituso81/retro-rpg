import { ListLink, ListSection } from '../components/List';
import { guideItems } from '../lib/nav';

export function GuideHubPage() {
  return (
    <>
      <header className="large-title">
        <h1>Guide</h1>
        <p className="lede">The story year: what to do each month, how to clear Tartarus, and every full-moon operation.</p>
      </header>

      <ListSection header="Story progression" footer="Start with the walkthrough if you are playing through for the first time.">
        {guideItems.map((item) => (
          <ListLink key={item.to} item={item} />
        ))}
      </ListSection>
    </>
  );
}
