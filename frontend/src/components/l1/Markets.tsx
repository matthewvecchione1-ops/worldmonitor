import { useMarkets } from '../../hooks/useMarkets';
import type { MarketTick, SectorPerf } from '../../types/market';

// ── Helpers ───────────────────────────────────────────────────────────────

function fmtPrice(price: number): string {
  if (price >= 10000) {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  if (price >= 1000) {
    return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  return '$' + price.toFixed(2);
}

function changeColor(change: number): string {
  if (change > 0) return '#00D878';
  if (change < 0) return '#FF2040';
  return '#8CA0BC';
}

function fmtChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function sectorStyle(change: number): { background: string; color: string } {
  if (change > 0) {
    return {
      background: `rgba(0, 216, 120, ${Math.min(change * 0.07, 0.22)})`,
      color: '#00D878',
    };
  }
  return {
    background: `rgba(255, 32, 64, ${Math.min(Math.abs(change) * 0.07, 0.22)})`,
    color: '#FF2040',
  };
}

// ── Sub-components ────────────────────────────────────────────────────────

function TickerRow({ tick }: { tick: MarketTick }) {
  const col = changeColor(tick.change);
  return (
    <div className="mk-item">
      <span className="mk-tick">{tick.ticker}</span>
      <span className="mk-px">{fmtPrice(tick.price)}</span>
      <span className="mk-ch" style={{ color: col }}>{fmtChange(tick.change)}</span>
    </div>
  );
}

function SectorCell({ sector }: { sector: SectorPerf }) {
  const s = sectorStyle(sector.change);
  return (
    <div className="sect-cell" style={s}>
      {sector.name}
      <span className="sect-val">{fmtChange(sector.change)}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────

export default function Markets() {
  const { data } = useMarkets();
  const tickers = data?.tickers ?? [];
  const sectors = data?.sectors ?? [];

  // Split into two columns: equities first, then commodities/crypto/index
  const leftCol = tickers.slice(0, 4);
  const rightCol = tickers.slice(4);

  return (
    <div className="wim-panel wim-panel-gr" style={{ animationDelay: '160ms' }}>
      {/* Header */}
      <div className="p-head">
        <span className="p-title">Markets &amp; Commodities</span>
        <span className="p-live">● LIVE</span>
        <span className="p-count">{tickers.length}</span>
      </div>

      {/* Body */}
      <div className="p-body" style={{ gap: 5 }}>
        {/* Ticker columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 8px', flex: 1, overflow: 'hidden' }}>
          <div>
            {leftCol.map((t) => <TickerRow key={t.ticker} tick={t} />)}
          </div>
          <div>
            {rightCol.map((t) => <TickerRow key={t.ticker} tick={t} />)}
          </div>
        </div>

        {/* Sector heatmap */}
        {sectors.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#2A3C52',
                textTransform: 'uppercase',
                marginBottom: 3,
              }}
            >
              Sectors
            </div>
            <div className="sect-grid">
              {sectors.map((s) => <SectorCell key={s.name} sector={s} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
