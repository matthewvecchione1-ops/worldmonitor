import { useIntelFeed } from '../../hooks/useIntelFeed';
import { useCountries } from '../../hooks/useCountries';

// ── Helpers ────────────────────────────────────────────────────────────────

function severityColor(severity: string): string {
  if (severity === 'breaking') return '#FF2040';
  if (severity === 'alert')    return '#FF6020';
  return '#8CA0BC';
}

function scoreColor(score: number): string {
  if (score >= 75) return '#FF2040';
  if (score >= 55) return '#FF6020';
  if (score >= 35) return '#F5A020';
  return '#00D878';
}

function trendArrow(trend: 'up' | 'down' | 'stable'): { symbol: string; color: string } {
  if (trend === 'up')   return { symbol: '↑', color: '#FF2040' };
  if (trend === 'down') return { symbol: '↓', color: '#00D878' };
  return { symbol: '—', color: '#2A3C52' };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function IntelRail() {
  const { data: feedData }     = useIntelFeed();
  const { data: countriesData } = useCountries();

  const signals   = feedData?.items.slice(0, 5) ?? [];
  const watchlist = countriesData?.countries.slice(0, 5) ?? [];

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

        {/* ── Trending Signals (real data from GDELT feed) ── */}
        <section style={{ padding: '11px 13px', borderBottom: '1px solid #1C2C42' }}>
          <div
            className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase mb-2"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: '#00CCFF' }} />
            Trending Signals
            <div className="flex-1 h-px bg-border" />
          </div>

          {signals.length === 0 ? (
            <div style={{ fontSize: 10, color: '#2A3C52', fontFamily: 'JetBrains Mono, monospace' }}>
              Connecting to feed…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {signals.map((sig) => (
                <div key={sig.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: severityColor(sig.severity),
                      flexShrink: 0,
                      marginTop: 4,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 10, color: '#8CA0BC', lineHeight: 1.45 }}>
                      {sig.headline}
                    </div>
                    {sig.timestamp && (
                      <div style={{ fontSize: 8, color: '#2A3C52', fontFamily: 'JetBrains Mono, monospace', marginTop: 1 }}>
                        {sig.timestamp} ago
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Quick Watchlist (real data from CII risk scores) ── */}
        <section style={{ padding: '11px 13px', borderBottom: '1px solid #1C2C42' }}>
          <div
            className="flex items-center gap-[6px] font-dis font-bold text-txt-3 uppercase mb-2"
            style={{ fontSize: 9, letterSpacing: '0.22em' }}
          >
            <span className="rounded-full flex-shrink-0" style={{ width: 5, height: 5, background: '#F5A020' }} />
            Quick Watchlist
            <div className="flex-1 h-px bg-border" />
          </div>

          {watchlist.length === 0 ? (
            <div style={{ fontSize: 10, color: '#2A3C52', fontFamily: 'JetBrains Mono, monospace' }}>
              Loading…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {watchlist.map((country) => {
                const arrow = trendArrow(country.trend);
                return (
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
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: scoreColor(country.score) }}>
                      {country.score}
                    </span>
                    <span style={{ fontSize: 9, color: arrow.color, width: 10, textAlign: 'center' }}>
                      {arrow.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
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
