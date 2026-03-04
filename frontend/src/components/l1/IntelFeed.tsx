import { useIntelFeed } from '../../hooks/useIntelFeed';

// ── Badge tag → CSS class mapping ────────────────────────────────────────

const BADGE_MAP: Record<string, string> = {
  ALERT:    'b-cr',
  MILITARY: 'b-ml',
  CONFLICT: 'b-ml',
  CYBER:    'b-cy',
  BREAKING: 'b-hi',
  MARKETS:  'b-lv',
};

function badgeClass(tag: string): string {
  return BADGE_MAP[tag] ?? 'b-cr';
}

// ── Component ─────────────────────────────────────────────────────────────

export default function IntelFeed() {
  const { data } = useIntelFeed(8);
  const items = data?.items ?? [];

  return (
    <div className="wim-panel wim-panel-cr" style={{ animationDelay: '0ms' }}>
      {/* Header */}
      <div className="p-head">
        <span className="p-title">Intel Feed</span>
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
            <div className={item.isUrgent ? 'fi-hl fi-hl-ur' : 'fi-hl'}>
              {item.headline}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
