import { useWorldNews } from '../../hooks/useWorldNews';

// ── Badge tag → CSS class mapping ────────────────────────────────────────

const BADGE_MAP: Record<string, string> = {
  ALERT:     'b-cr',
  BREAKING:  'b-hi',
  MILITARY:  'b-ml',
  CONFLICT:  'b-ml',
  CYBER:     'b-cy',
  DIPLOMACY: 'b-lv',
  MARKETS:   'b-lv',
};

function badgeClass(tag: string): string {
  return BADGE_MAP[tag] ?? 'b-lv';
}

// ── Component ─────────────────────────────────────────────────────────────

export default function WorldNews() {
  const { data } = useWorldNews(7);
  const items = data?.items ?? [];

  return (
    <div className="wim-panel wim-panel-ac" style={{ animationDelay: '240ms' }}>
      {/* Header */}
      <div className="p-head">
        <span className="p-title">World News</span>
        <span className="p-live">● LIVE</span>
        <span className="p-count">{items.length}</span>
      </div>

      {/* Body */}
      <div className="p-body">
        {items.map((item) => (
          <div key={item.id} className="fi">
            <div className="fi-meta">
              <span className="fi-src">{item.source}</span>
              {item.tags.slice(0, 1).map((tag) => (
                <span key={tag} className={`b ${badgeClass(tag)}`}>{tag}</span>
              ))}
              <span className="fi-time">{item.timestamp}</span>
            </div>
            <div
              className={item.isUrgent ? 'fi-hl fi-hl-ur' : 'fi-hl'}
              onClick={item.url ? () => window.open(item.url!, '_blank', 'noopener,noreferrer') : undefined}
              style={item.url ? { cursor: 'pointer' } : undefined}
              title={item.url ? 'Open source article' : undefined}
            >
              {item.headline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
