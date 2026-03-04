import { useState } from 'react';
import { useFocusStore } from '../../stores/useFocusStore';
import { useHeroAlert } from '../../hooks/useHeroAlert';

/** Split "Crisis Name — Day N: rest of headline" at the first ": " */
function splitHeadline(headline: string): [string, string] {
  const idx = headline.indexOf(': ');
  if (idx === -1) return ['', headline];
  return [headline.slice(0, idx + 1), headline.slice(idx + 2)];
}

export default function HeroAlert() {
  const { data: alert } = useHeroAlert();
  const [dismissed, setDismissed] = useState(false);
  const openCountryFocus = useFocusStore((s) => s.openCountryFocus);

  if (!alert || dismissed) return null;

  const [boldPart, restPart] = splitHeadline(alert.headline);
  const probabilityPct = Math.round(alert.probability * 100);

  return (
    <div
      onClick={() => openCountryFocus(alert.countryId)}
      className="relative flex items-center gap-3 cursor-pointer flex-shrink-0"
      style={{
        padding: '12px 18px',
        background: 'rgba(255,32,64,0.05)',
        borderBottom: '1px solid rgba(255,32,64,0.2)',
        transition: 'background 200ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,32,64,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,32,64,0.05)';
      }}
    >
      {/* 3px left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{ width: 3, background: '#FF2040' }}
      />

      {/* Right-fade gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(255,32,64,0.04), transparent 60%)' }}
      />

      {/* ⚠ CRITICAL badge */}
      <div
        className="font-dis font-bold uppercase flex-shrink-0 relative"
        style={{
          fontSize: 8,
          letterSpacing: '0.15em',
          padding: '3px 10px',
          borderRadius: 3,
          background: 'rgba(255,32,64,0.2)',
          color: '#FF2040',
          border: '1px solid rgba(255,32,64,0.35)',
          animation: 'heroPulse 3s ease-in-out infinite',
        }}
      >
        ⚠ CRITICAL
      </div>

      {/* Headline: bold crisis name + dimmer rest */}
      <div
        className="font-bod relative flex-1"
        style={{ fontSize: 13, fontWeight: 500, color: '#ECF0F8', lineHeight: 1.4 }}
      >
        {boldPart && (
          <strong style={{ color: '#FF2040', fontWeight: 700 }}>{boldPart} </strong>
        )}
        {restPart}
      </div>

      {/* Probability + dossier link */}
      <div
        className="font-mon text-txt-3 flex-shrink-0 text-right relative"
        style={{ fontSize: 9, maxWidth: 260, lineHeight: 1.4 }}
        onClick={(e) => { e.stopPropagation(); openCountryFocus(alert.countryId); }}
      >
        {probabilityPct}% probability {alert.probabilityLabel} · Click for full dossier →
      </div>

      {/* Dismiss ✕ */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        className="relative text-txt-3 hover:text-txt-1 cursor-pointer transition-colors duration-150 flex-shrink-0"
        style={{ fontSize: 13, padding: 4, background: 'none', border: 'none', lineHeight: 1 }}
      >
        ✕
      </button>
    </div>
  );
}
