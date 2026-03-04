import { useEffect, type CSSProperties } from 'react';
import { useFocusStore } from '../../stores/useFocusStore';
import { useCountryDossier } from '../../hooks/useCountries';
import TheaterMap from './TheaterMap';
import type { CountryRiskLevel, TimelineEvent } from '../../types/country';

// ── Color helpers ────────────────────────────────────────────────────────────

function riskColors(level: CountryRiskLevel): { bg: string; border: string; text: string } {
  switch (level) {
    case 'critical': return { bg: 'rgba(255,32,64,0.15)',  border: 'rgba(255,32,64,0.4)',  text: '#FF2040' };
    case 'high':     return { bg: 'rgba(255,96,32,0.12)',  border: 'rgba(255,96,32,0.35)', text: '#FF6020' };
    case 'elevated': return { bg: 'rgba(245,160,32,0.12)', border: 'rgba(245,160,32,0.35)',text: '#F5A020' };
    case 'moderate': return { bg: 'rgba(26,143,255,0.12)', border: 'rgba(26,143,255,0.35)',text: '#1A8FFF' };
    case 'low':      return { bg: 'rgba(0,216,120,0.08)',  border: 'rgba(0,216,120,0.25)', text: '#00D878' };
  }
}

function tlDotColor(severity: TimelineEvent['severity']): string {
  switch (severity) {
    case 'critical': return '#FF2040';
    case 'high':     return '#FF6020';
    case 'moderate': return '#F5A020';
    case 'low':      return '#4E6480';
  }
}

function predColor(p: number): string {
  if (p >= 0.85) return '#FF2040';
  if (p >= 0.65) return '#FF6020';
  if (p >= 0.45) return '#F5A020';
  return '#4E6480';
}

function entityRiskColor(risk: number): string {
  if (risk >= 85) return '#FF2040';
  if (risk >= 65) return '#FF6020';
  if (risk >= 45) return '#F5A020';
  return '#4E6480';
}

// CSS custom property helper — required to satisfy TypeScript strict mode
function accent(color: string): CSSProperties {
  return { '--card-accent': color } as CSSProperties;
}

// ── Markdown renderer ────────────────────────────────────────────────────────

function renderInlineBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} style={{ color: '#ECF0F8', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
          : part
      )}
    </>
  );
}

function renderMarkdown(text: string | undefined): React.ReactNode {
  if (!text) return null;
  return text.split('\n').map((raw, i) => {
    const line = raw.trim();
    if (!line) return <div key={i} style={{ height: 8 }} />;

    // Markdown headers (## or ###)
    const hm = line.match(/^#{1,3}\s+(.+)$/);
    if (hm) return (
      <div key={i} style={{ fontSize: 13, fontWeight: 700, color: '#8CA0BC', marginTop: 10, marginBottom: 4, letterSpacing: '0.04em' }}>
        {hm[1]}
      </div>
    );

    // Bullet lines (* item, - item, • item)
    const bm = line.match(/^[\*\-•]\s+(.+)$/);
    if (bm) return (
      <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
        <span style={{ color: '#4E6480', flexShrink: 0 }}>›</span>
        <span>{renderInlineBold(bm[1])}</span>
      </div>
    );

    // Regular paragraph line
    return (
      <div key={i} style={{ marginBottom: 4 }}>{renderInlineBold(line)}</div>
    );
  });
}

// ── CountryFocus ─────────────────────────────────────────────────────────────

export default function CountryFocus() {
  const { focusedCountryId, closeCountryFocus } = useFocusStore();
  const { data: dossier } = useCountryDossier(focusedCountryId);

  // ESC key + body scroll lock
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCountryFocus();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [closeCountryFocus]);

  // Loading state
  if (!focusedCountryId || !dossier) {
    return (
      <div className="cf-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4E6480' }}>
          Loading intelligence…
        </div>
      </div>
    );
  }

  const rc = riskColors(dossier.riskLevel);

  // Determine which sections have real data
  const hasStats       = dossier.stats.length > 0;
  const hasEntities    = dossier.entities.length > 0;
  const hasTimeline    = dossier.timeline.length > 0;
  const hasFinancial   = !!(dossier.financial.markets || dossier.financial.sanctions || dossier.financial.trade || dossier.financial.currency);
  const hasPredictions = dossier.predictions.length > 0;
  const hasMilitary    = !!(dossier.military.summary || dossier.military.assets?.length);

  // Dynamic grid for row 1: situaton always + optional stats/entities
  const row1SecondaryCount = (hasStats ? 1 : 0) + (hasEntities ? 1 : 0);
  const row1Template = row1SecondaryCount === 2 ? '1fr 1fr 1fr'
    : row1SecondaryCount === 1 ? '1fr 1fr'
    : '1fr';

  // Row 2 / 3 visibility and templates
  const showRow2    = hasTimeline || hasFinancial;
  const row2Template = (hasTimeline && hasFinancial) ? '1fr 1fr' : '1fr';
  const showRow3    = hasPredictions || hasMilitary;
  const row3Template = (hasPredictions && hasMilitary) ? '1fr 1fr' : '1fr';

  return (
    <div className="cf-overlay">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="cf-header">
        <button
          className="cf-back"
          onClick={closeCountryFocus}
          title="Close (Esc)"
          aria-label="Close dossier"
        >
          ←
        </button>

        {dossier.flagEmoji && (
          <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{dossier.flagEmoji}</div>
        )}

        <div className="cf-title-wrap">
          <div className="cf-country-name">{dossier.name}</div>
          <div className="cf-country-meta">
            {dossier.officialName}
            {dossier.region ? ` · ${dossier.region}` : ''}
            {dossier.population ? ` · Pop. ${dossier.population}` : ''}
          </div>
        </div>

        {/* Risk pill */}
        <div
          className="cf-risk-pill"
          style={{ background: rc.bg, borderColor: rc.border }}
        >
          <div>
            <div className="cf-risk-num" style={{ color: rc.text }}>
              {dossier.riskScore > 0 ? dossier.riskScore : '—'}
            </div>
            <div className="cf-risk-lbl" style={{ color: rc.text }}>Instability</div>
          </div>
          {dossier.riskScore > 0 && (
            <div className="cf-risk-delta" style={{ color: rc.text }}>/100</div>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="cf-body">

        {/* Theater Map — centered on actual country */}
        <div className="cf-map-wrap">
          <div className="cf-map-title">THEATER OPERATIONS MAP — {dossier.name.toUpperCase()}</div>
          <TheaterMap countryCode={focusedCountryId ?? ''} />
        </div>

        {/* Row 1 — Situation Brief always; Stats/Entities conditionally */}
        <div style={{ display: 'grid', gridTemplateColumns: row1Template, gap: 6, marginBottom: 6 }}>

          {/* Situation Brief — always shown */}
          <div className="cf-card" style={accent('#FF2040')}>
            <div className="cf-card-head">
              <div className="cf-card-title">Situation Brief</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#00F080' }}>● LIVE</span>
            </div>
            <div className="cf-card-body">
              <div className="cf-situation">{renderMarkdown(dossier.situation)}</div>
            </div>
          </div>

          {/* Current Stats — only if data exists */}
          {hasStats && (
            <div className="cf-card" style={accent('#FF6020')}>
              <div className="cf-card-head">
                <div className="cf-card-title">Current Stats</div>
              </div>
              <div className="cf-card-body">
                {dossier.stats.map((stat) => (
                  <div key={stat.label} className="cf-stat">
                    <div className="cf-stat-lbl">{stat.label}</div>
                    <div
                      className="cf-stat-val"
                      style={stat.valueColor ? { color: stat.valueColor } : undefined}
                    >
                      {stat.value}
                    </div>
                    {stat.change !== null && (
                      <div className="cf-stat-chg">{stat.change}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Entities — only if data exists */}
          {hasEntities && (
            <div className="cf-card" style={accent('#CC44FF')}>
              <div className="cf-card-head">
                <div className="cf-card-title">Key Entities</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#CC44FF' }}>
                  {dossier.entities.length}
                </span>
              </div>
              <div className="cf-card-body">
                {dossier.entities.map((ent) => (
                  <div key={ent.id} className="cf-rel">
                    <span className="cf-rel-icon">{ent.icon}</span>
                    <span className="cf-rel-name">{ent.name}</span>
                    <span className="cf-rel-role">{ent.type}</span>
                    <span className="cf-rel-risk" style={{ color: entityRiskColor(ent.risk) }}>
                      {ent.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>{/* /row 1 */}

        {/* Row 2 — Event Timeline | Financial Impact (only if data exists) */}
        {showRow2 && (
          <div style={{ display: 'grid', gridTemplateColumns: row2Template, gap: 6, marginBottom: 6 }}>

            {hasTimeline && (
              <div className="cf-card" style={accent('#1A8FFF')}>
                <div className="cf-card-head">
                  <div className="cf-card-title">Event Timeline</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#4E6480' }}>
                    {dossier.timeline.length} events
                  </span>
                </div>
                <div className="cf-card-body">
                  <div className="cf-timeline">
                    {dossier.timeline.map((ev, i) => {
                      const dotColor = tlDotColor(ev.severity);
                      return (
                        <div key={i} className="cf-tl-item">
                          <div className="cf-tl-dot" style={{ borderColor: dotColor }} />
                          <div className="cf-tl-time">{ev.time}</div>
                          <div className="cf-tl-text">{ev.text}</div>
                          <div className="cf-tl-src">{ev.sources}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {hasFinancial && (
              <div className="cf-card" style={accent('#F5A020')}>
                <div className="cf-card-head">
                  <div className="cf-card-title">Financial Impact</div>
                </div>
                <div className="cf-card-body">
                  {dossier.financial.markets && (
                    <div className="cf-fin-row">
                      <div className="cf-fin-lbl">Markets</div>
                      {dossier.financial.markets}
                    </div>
                  )}
                  {dossier.financial.sanctions && (
                    <div className="cf-fin-row">
                      <div className="cf-fin-lbl">Sanctions</div>
                      {dossier.financial.sanctions}
                    </div>
                  )}
                  {dossier.financial.trade && (
                    <div className="cf-fin-row">
                      <div className="cf-fin-lbl">Trade &amp; Logistics</div>
                      {dossier.financial.trade}
                    </div>
                  )}
                  {dossier.financial.currency && (
                    <div className="cf-fin-row">
                      <div className="cf-fin-lbl">Currency</div>
                      {dossier.financial.currency}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}{/* /row 2 */}

        {/* Row 3 — AI Predictions | Military Posture (only if data exists) */}
        {showRow3 && (
          <div style={{ display: 'grid', gridTemplateColumns: row3Template, gap: 6, marginBottom: 6 }}>

            {hasPredictions && (
              <div className="cf-card" style={accent('#00CCFF')}>
                <div className="cf-card-head">
                  <div className="cf-card-title">AI Predictions</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#CC44FF' }}>
                    MODEL
                  </span>
                </div>
                <div className="cf-card-body">
                  {dossier.predictions.map((pred, i) => {
                    const pc = predColor(pred.probability);
                    return (
                      <div key={i} className="pred-card">
                        <div className="pred-top">
                          <div className="pred-event">{pred.event}</div>
                          <div className="pred-prob" style={{ color: pc }}>
                            {Math.round(pred.probability * 100)}%
                          </div>
                        </div>
                        <div className="pred-timeline">{pred.timeline} · {pred.confidence}</div>
                        <div className="pred-bar-w">
                          <div
                            className="pred-bar"
                            style={{ width: `${pred.probability * 100}%`, background: pc }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasMilitary && (
              <div className="cf-card" style={accent('#FF6020')}>
                <div className="cf-card-head">
                  <div className="cf-card-title">Military Posture</div>
                  {dossier.military.readiness && (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: '#FF2040', letterSpacing: '0.04em' }}>
                      {dossier.military.readiness}
                    </span>
                  )}
                </div>
                <div className="cf-card-body">
                  {dossier.military.summary && (
                    <p style={{ fontSize: 11, color: '#8CA0BC', lineHeight: 1.55, marginBottom: 10, marginTop: 0 }}>
                      {dossier.military.summary}
                    </p>
                  )}
                  {dossier.military.assets?.map((asset, i) => (
                    <div key={i} className="cf-asset">{asset}</div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}{/* /row 3 */}

      </div>{/* /cf-body */}
    </div>
  );
}
