import { useKPIs } from '../../hooks/useKPIs';
import KPICard from './KPICard';

// Per-card display config — matches prototype's --kc (accent) and --kg (glow) CSS vars
const KPI_CONFIG: Array<{ accent: string; glow: string; valueColor?: string }> = [
  { accent: '#FF6020', glow: 'rgba(255,96,32,0.08)' },                        // Global Risk Score
  { accent: '#FF2040', glow: 'rgba(255,32,64,0.07)' },                        // Active Threats
  { accent: '#FF2040', glow: 'rgba(255,32,64,0.05)' },                        // Crisis Countries
  { accent: '#00CCFF', glow: 'rgba(0,204,255,0.05)',  valueColor: '#00CCFF' }, // Live Signals
  { accent: '#CC44FF', glow: 'rgba(204,68,255,0.05)', valueColor: '#CC44FF' }, // Cyber Incidents
  { accent: '#00AAFF', glow: 'rgba(0,170,255,0.05)',  valueColor: '#00AAFF' }, // Vessels Tracked
];

// Staggered entrance animation delays matching prototype (200ms, 280ms, …, 600ms)
const ANIMATION_DELAYS = [200, 280, 360, 440, 520, 600];

export default function KPIStrip() {
  const { data } = useKPIs();
  const kpis = data?.kpis ?? [];

  return (
    <div
      className="flex-shrink-0 border-b border-border"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr 1fr',
        gap: 6,
        padding: 6,
        background: 'rgba(5,8,15,0.7)',
      }}
    >
      {kpis.map((kpi, i) => {
        const cfg = KPI_CONFIG[i] ?? { accent: '#00CCFF', glow: 'rgba(0,204,255,0.06)' };
        return (
          <KPICard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            changePeriod={kpi.changePeriod}
            context={kpi.context}
            isPrimary={kpi.isPrimary}
            accentColor={cfg.accent}
            glowColor={cfg.glow}
            valueColor={cfg.valueColor}
            animationDelay={ANIMATION_DELAYS[i] ?? 200}
          />
        );
      })}
    </div>
  );
}
