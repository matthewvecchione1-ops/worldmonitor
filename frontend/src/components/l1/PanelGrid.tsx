import IntelFeed from './IntelFeed';
import CountryInstability from './CountryInstability';
import Markets from './Markets';
import WorldNews from './WorldNews';

// ── Component ─────────────────────────────────────────────────────────────

export default function PanelGrid() {
  return (
    <>
      {/* Section context — titles the live feed panels */}
      <div className="section-context">
        <span className="sc-icon">◈</span>
        <strong>Live Feeds</strong>
        {' '}— Real-time intel, ranked by relevance to the Iran crisis.
        Click any headline for full source.
      </div>

      {/* 4-column panel grid */}
      <div className="wim-panels">
        <IntelFeed />
        <CountryInstability />
        <Markets />
        <WorldNews />
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint">
        ▾ Scroll for Deep Intelligence · Markets · Investigation Canvas ▾
      </div>

      {/* Section divider — marks start of Level 2 content */}
      <div className="section-divider">
        <div className="sd-line" />
        <div className="sd-label">Level 2 · Deep Intelligence</div>
        <div className="sd-line" />
      </div>
    </>
  );
}
