// ── Mock data ──────────────────────────────────────────────────────────────

const TRENDING_SIGNALS = [
  { id: 't1', text: 'IRGC declares maximum readiness posture', time: '2h', color: '#FF2040' },
  { id: 't2', text: 'US carrier group repositioned Gulf of Oman', time: '3h', color: '#FF6020' },
  { id: 't3', text: 'APT33 wiper campaign on Gulf energy sector', time: '5h', color: '#CC44FF' },
  { id: 't4', text: 'Hormuz: 4 tankers reversed course', time: '6h', color: '#FF6020' },
  { id: 't5', text: 'G7 emergency session convened on Iran', time: '1h', color: '#F5A020' },
];

const ACTIVE_ALERTS = [
  { id: 'a1', text: 'Iran retaliatory strike imminent (94%)', sev: '#FF2040', label: 'CRITICAL' },
  { id: 'a2', text: 'Hormuz disruption risk elevated to HIGH', sev: '#FF6020', label: 'HIGH' },
  { id: 'a3', text: 'APT33 active on US defense contractors', sev: '#CC44FF', label: 'CYBER' },
];

const WATCHLIST = [
  { id: 'iran',    name: 'Iran',    score: 92, trend: '↑', scoreColor: '#FF2040' },
  { id: 'ukraine', name: 'Ukraine', score: 78, trend: '—', scoreColor: '#FF6020' },
  { id: 'taiwan',  name: 'Taiwan',  score: 65, trend: '↑', scoreColor: '#FF6020' },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function IntelRail() {
  return (
    <aside
      className="flex flex-col overflow-hidden relative z-10"
      style={{
        background: 'rgba(6,10,18,0.98)',
        borderLeft: '1px solid #1C2C42',
      }}
    >
      {/* Accent gradient line on left edge */}
      <div
        className="absolute top-0 left-0 w-px h-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0,204,255,0.25) 30%, rgba(0,204,255,0.1) 70%, transparent)',
        }}
      />

      {/* Header */}
      <div
        className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase flex-shrink-0"
        style={{
          fontSize: 9,
          letterSpacing: '0.22em',
          padding: '11px 13px 8px',
          borderBottom: '1px solid #1C2C42',
        }}
      >
        <span
          className="rounded-full flex-shrink-0"
          style={{ width: 5, height: 5, background: '#00CCFF', animation: 'pulse-live 2.2s ease-in-out infinite' }}
        />
        INTELLIGENCE
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

        {/* ── Trending Signals ── */}
        <section style={{ padding: '11px 13px', borderBottom: '1px solid #1C2C42' }}>
          <div
            className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase mb-2"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: '#00CCFF' }} />
            Trending Signals
            <div className="flex-1 h-px bg-border" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {TRENDING_SIGNALS.map((sig) => (
              <div key={sig.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: sig.color,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <div>
                  <div style={{ fontSize: 10, color: '#8CA0BC', lineHeight: 1.45 }}>
                    {sig.text}
                  </div>
                  <div style={{ fontSize: 8, color: '#2A3C52', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>
                    {sig.time} ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Active Alerts ── */}
        <section style={{ padding: '11px 13px', borderBottom: '1px solid #1C2C42' }}>
          <div
            className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase mb-2"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: '#FF2040' }} />
            Active Alerts
            <div className="flex-1 h-px bg-border" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {ACTIVE_ALERTS.map((alert) => (
              <div key={alert.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span
                  style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 700,
                    fontSize: 7,
                    letterSpacing: '0.08em',
                    color: alert.sev,
                    background: `${alert.sev}18`,
                    border: `1px solid ${alert.sev}40`,
                    borderRadius: 2,
                    padding: '1px 4px',
                    flexShrink: 0,
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {alert.label}
                </span>
                <div style={{ fontSize: 10, color: '#8CA0BC', lineHeight: 1.45 }}>
                  {alert.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Watchlist ── */}
        <section style={{ padding: '11px 13px', borderBottom: '1px solid #1C2C42' }}>
          <div
            className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase mb-2"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: '#F5A020' }} />
            Quick Watchlist
            <div className="flex-1 h-px bg-border" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {WATCHLIST.map((country) => (
              <div
                key={country.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 0',
                  borderBottom: '1px solid rgba(28,44,66,0.4)',
                }}
              >
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, fontSize: 11, color: '#ECF0F8', flex: 1 }}>
                  {country.name}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: country.scoreColor }}>
                  {country.score}
                </span>
                <span style={{ fontSize: 9, color: country.trend === '↑' ? '#FF2040' : '#2A3C52', width: 10, textAlign: 'center' }}>
                  {country.trend}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom strip */}
      <div
        className="flex items-center justify-center gap-2 font-dis font-semibold text-txt-3 uppercase cursor-pointer transition-all duration-150 flex-shrink-0 hover:bg-surface hover:text-acc"
        style={{
          fontSize: 9,
          letterSpacing: '0.2em',
          padding: 4,
          background: '#080D18',
          borderTop: '1px solid #1C2C42',
        }}
      >
        ▾ More Intelligence
      </div>
    </aside>
  );
}
