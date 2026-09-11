import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { StoreProvider } from './lib/store';
import { HomePage } from './pages/HomePage';
import { WalkthroughPage } from './pages/WalkthroughPage';
import { TartarusPage } from './pages/TartarusPage';
import { BossesPage } from './pages/BossesPage';
import { CharactersPage, CharacterDetailPage } from './pages/CharactersPage';
import { SocialLinksPage } from './pages/SocialLinksPage';
import { LinkedEpisodesPage } from './pages/LinkedEpisodesPage';
import { PersonasPage } from './pages/PersonasPage';
import { ItemsPage } from './pages/ItemsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { RequestsPage } from './pages/RequestsPage';
import { SchoolPage } from './pages/SchoolPage';
import { TipsPage } from './pages/TipsPage';
import { SecretsPage } from './pages/SecretsPage';

export function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/walkthrough" element={<WalkthroughPage />} />
            <Route path="/walkthrough/:month" element={<WalkthroughPage />} />
            <Route path="/tartarus" element={<TartarusPage />} />
            <Route path="/bosses" element={<BossesPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/characters/:id" element={<CharacterDetailPage />} />
            <Route path="/social-links" element={<SocialLinksPage />} />
            <Route path="/linked-episodes" element={<LinkedEpisodesPage />} />
            <Route path="/personas" element={<PersonasPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/school" element={<SchoolPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/secrets" element={<SecretsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
