import { useCountries } from '../../hooks/useCountries';
import { useFocusStore } from '../../stores/useFocusStore';
import type { TrendDirection } from '../../types/country';

// ── Helpers ───────────────────────────────────────────────────────────────

function barColor(score: number): string {
  if (score >= 80) return '#FF2040';
  if (score >= 60) return '#FF6020';
  if (score >= 40) return '#F5A020';
  return '#00D878';
}

function scoreColor(score: number): string {
  if (score >= 80) return '#FF2040';
  if (score >= 60) return '#FF6020';
  if (score >= 40) return '#F5A020';
  return '#00D878';
}

function trendArrow(trend: TrendDirection): { symbol: string; color: string } {
  if (trend === 'up')   return { symbol: '↑', color: '#FF2040' };
  if (trend === 'down') return { symbol: '↓', color: '#00D878' };
  return { symbol: '—', color: '#2A3C52' };
}

// ── Component ─────────────────────────────────────────────────────────────

export default function CountryInstability() {
  const { data } = useCountries(10);
  const countries = data?.countries ?? [];
  const openCountryFocus = useFocusStore((s) => s.openCountryFocus);

  return (
    <div className="wim-panel wim-panel-hi" style={{ animationDelay: '80ms' }}>
      {/* Header */}
      <div className="p-head">
        <span className="p-title">Instability Index</span>
        <span className="p-count">{countries.length}</span>
      </div>

      {/* Body */}
      <div className="p-body">
        {countries.map((country) => {
          const arrow = trendArrow(country.trend);
          return (
            <div
              key={country.id}
              className="ib-item"
              onClick={() => openCountryFocus(country.id)}
              title={`Open ${country.name} dossier`}
            >
              <span className="ib-cnt">{country.name}</span>
              <div className="ib-bar-w">
                <div
                  className="ib-bar"
                  style={{
                    width: `${country.score}%`,
                    background: barColor(country.score),
                  }}
                />
              </div>
              <span className="ib-sc" style={{ color: scoreColor(country.score) }}>
                {country.score}
              </span>
              <span className="ib-ar" style={{ color: arrow.color }}>
                {arrow.symbol}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
