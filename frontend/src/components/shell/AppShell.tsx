import { useEffect } from 'react';
import { useLayoutStore } from '../../stores/useLayoutStore';
import { useFocusStore } from '../../stores/useFocusStore';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import IntelRail from './IntelRail';
import HeroAlert from '../l1/HeroAlert';
import KPIStrip from '../l1/KPIStrip';
import GlobalMap from '../l1/GlobalMap';
import PanelGrid from '../l1/PanelGrid';
import CountryFocus from '../overlays/CountryFocus';
import DigestMode from '../overlays/DigestMode';
import SearchPalette from '../overlays/SearchPalette';
import L2Grid from '../l2/L2Grid';

export default function AppShell() {
  const { sidebarVisible, railVisible, digestOpen, setDigestOpen, searchOpen, setSearchOpen } = useLayoutStore();
  const { focusedCountryId, closeCountryFocus } = useFocusStore();

  // Global keyboard shortcut: ⌘K / Ctrl+K → open search palette
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [setSearchOpen]);

  // Mutual exclusion — opening DigestMode closes CountryFocus
  useEffect(() => {
    if (digestOpen && focusedCountryId !== null) {
      closeCountryFocus();
    }
  }, [digestOpen, focusedCountryId, closeCountryFocus]);

  // Mutual exclusion — opening CountryFocus closes DigestMode
  useEffect(() => {
    if (focusedCountryId !== null && digestOpen) {
      setDigestOpen(false);
    }
  }, [focusedCountryId, digestOpen, setDigestOpen]);

  // Build grid-template-columns based on visible panels
  const gridCols = [
    sidebarVisible ? '52px' : null,
    '1fr',
    railVisible ? '296px' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-void text-txt-1 font-bod"
      style={{
        display: 'grid',
        gridTemplateColumns: gridCols,
        gridTemplateRows: '48px 1fr',
      }}
    >
      {/* TopBar spans all columns */}
      <TopBar />

      {/* Sidebar — col 1, row 2 (only if visible) */}
      {sidebarVisible && <Sidebar />}

      {/* Main content area */}
      <main
        className="flex flex-col overflow-y-auto overflow-x-hidden bg-void relative z-10"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#1C2C42 transparent',
        }}
      >
        {/* Phase 2: Hero Alert + KPI Strip */}
        <HeroAlert />
        <KPIStrip />

        {/* Phase 3: Global Map */}
        <GlobalMap />

        {/* Phase 4: Panel Grid */}
        <PanelGrid />

        {/* Phase 7: L2 Deep Intelligence */}
        <L2Grid />
      </main>

      {/* Intel Rail — last col, row 2 (only if visible) */}
      {railVisible && <IntelRail />}

      {/* Phase 5: Country Focus Dossier — fixed overlay, escapes grid flow */}
      {focusedCountryId !== null && <CountryFocus />}

      {/* Phase 6: Digest Mode — fixed overlay, z-index below CountryFocus */}
      {digestOpen && <DigestMode />}

      {/* Phase 7: Search Palette — z-index 9000, above all overlays */}
      {searchOpen && <SearchPalette />}
    </div>
  );
}
