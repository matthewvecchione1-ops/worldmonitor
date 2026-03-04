import type React from 'react';
import { formatNumber } from '../../lib/formatters';

export interface KPICardProps {
  label: string;
  value: number | string;
  change?: number | null;
  changePeriod?: string;
  context?: string;
  isPrimary?: boolean;
  accentColor?: string;
  glowColor?: string;
  valueColor?: string;
  animationDelay?: number;
}

function getChangeNode(
  change: number | null | undefined,
  changePeriod: string | undefined,
): React.ReactNode {
  if (changePeriod === 'Live AIS') {
    return (
      <span style={{ color: '#00CCFF' }}>
        ◆ <span style={{ opacity: 0.6, fontSize: 8 }}>Live AIS</span>
      </span>
    );
  }
  if (changePeriod === 'stable' || change === 0) {
    return (
      <span style={{ color: '#4E6480' }}>
        → <span style={{ opacity: 0.6, fontSize: 8 }}>Stable</span>
      </span>
    );
  }
  if (change != null && change > 0) {
    return (
      <span style={{ color: '#00D878' }}>
        ↑ <span style={{ opacity: 0.6, fontSize: 8 }}>+{change} ({changePeriod})</span>
      </span>
    );
  }
  if (change != null && change < 0) {
    return (
      <span style={{ color: '#FF2040' }}>
        ↓ <span style={{ opacity: 0.6, fontSize: 8 }}>{change} ({changePeriod})</span>
      </span>
    );
  }
  return null;
}

function getPrimaryValueColor(value: number | string): string {
  const n =
    typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  if (n > 70) return '#FF2040';
  if (n > 50) return '#FF6020';
  if (n > 30) return '#F5A020';
  return '#ECF0F8';
}

export default function KPICard({
  label,
  value,
  change,
  changePeriod,
  context,
  isPrimary = false,
  accentColor = '#00CCFF',
  glowColor = 'rgba(0,204,255,0.06)',
  valueColor,
  animationDelay = 0,
}: KPICardProps) {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  const computedValueColor = valueColor
    ? valueColor
    : isPrimary
    ? getPrimaryValueColor(value)
    : '#ECF0F8';

  // Primary card: 3px left accent — crit red if score > 70, acc cyan otherwise
  const leftAccentColor = isPrimary
    ? typeof value === 'number' && value > 70
      ? '#FF2040'
      : '#00CCFF'
    : null;

  return (
    <div
      className="relative overflow-hidden cursor-pointer transition-all duration-200 border border-border hover:border-border-hi bg-deep hover:bg-surface"
      style={{
        padding: isPrimary ? '10px 14px' : '9px 12px',
        borderRadius: 5,
        animation: `kpiIn 500ms ease-out ${animationDelay}ms both`,
      }}
    >
      {/* Primary card — 3px left accent bar */}
      {leftAccentColor && (
        <div
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
          style={{ width: 3, background: leftAccentColor }}
        />
      )}

      {/* Top gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% -20%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Content (above decorative overlays) */}
      <div className="relative">
        {/* Label */}
        <div
          className="font-dis font-bold uppercase text-txt-3"
          style={{ fontSize: 9, letterSpacing: '0.18em', marginBottom: 3 }}
        >
          {label}
        </div>

        {/* Value */}
        <div
          className="font-dis font-bold leading-none"
          style={{
            fontSize: isPrimary ? 32 : 26,
            color: computedValueColor,
          }}
        >
          {displayValue}
        </div>

        {/* Change indicator */}
        <div className="font-mon flex items-center gap-1 mt-0.5" style={{ fontSize: 9 }}>
          {getChangeNode(change, changePeriod)}
        </div>

        {/* Context line — primary card only */}
        {isPrimary && context && (
          <div className="font-mon text-txt-3 mt-1" style={{ fontSize: 8, lineHeight: 1.4 }}>
            {context}
          </div>
        )}
      </div>
    </div>
  );
}
