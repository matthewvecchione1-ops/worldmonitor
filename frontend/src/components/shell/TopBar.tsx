import { useState, useEffect } from 'react';
import { useLayoutStore } from '../../stores/useLayoutStore';
import { useKPIs } from '../../hooks/useKPIs';

// Format UTC clock: "SUN, 01 MAR 2026   18:19:34 UTC"
function formatClock(d: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = days[d.getUTCDay()];
  const date = String(d.getUTCDate()).padStart(2, '0');
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${day}, ${date} ${month} ${year}   ${hh}:${mm}:${ss} UTC`;
}

type Mode = 'LIVE' | '24H' | '7D' | 'STRATEGIC';
const MODES: Mode[] = ['LIVE', '24H', '7D', 'STRATEGIC'];

export default function TopBar() {
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const [activeMode, setActiveMode] = useState<Mode>('LIVE');
  const { setNotificationsOpen, setMultiMonitorOpen, setSearchOpen, digestOpen, setDigestOpen } = useLayoutStore();

  // Real DEFCON — derived from global risk score
  const { data: kpiData } = useKPIs();
  const riskKPI = kpiData?.kpis.find(k => k.id === 'global-risk');
  const globalScore: number | null = typeof riskKPI?.value === 'number' ? riskKPI.value : null;
  const defcon = globalScore == null ? 5
    : globalScore >= 80 ? 1
    : globalScore >= 60 ? 2
    : globalScore >= 40 ? 3
    : globalScore >= 20 ? 4
    : 5;
  const defconPct = globalScore ?? 0;
  const defconColor = defcon === 1 ? '#FF2040'
    : defcon === 2 ? '#FF6020'
    : defcon === 3 ? '#F5A020'
    : defcon === 4 ? '#00CCFF'
    : '#00D878';

  // Live UTC clock
  useEffect(() => {
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="col-span-full row-start-1 flex items-center border-b border-border z-[200] px-0 pr-[14px]"
      style={{
        background: 'rgba(5,8,15,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'barDrop 600ms cubic-bezier(0.34,1.56,0.64,1) both',
      }}
    >

      {/* ── Logo ── */}
      <div
        className="flex items-center h-full px-[18px] border-r border-border mr-4 flex-shrink-0 cursor-pointer relative group"
      >
        <div>
          <div
            className="font-dis font-bold text-txt-1"
            style={{ fontSize: 22, letterSpacing: '0.2em' }}
          >
            W<span className="text-acc">·</span>I<span className="text-acc">·</span>M
          </div>
          <div
            className="font-mon text-txt-3 uppercase absolute bottom-[7px] left-[18px]"
            style={{ fontSize: 8, letterSpacing: '0.3em' }}
          >
            World Intelligence Monitor
          </div>
        </div>
        {/* hover underline gradient */}
        <div className="absolute bottom-0 left-[18px] right-[18px] h-px bg-gradient-to-r from-transparent via-acc to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* ── Mode Pills ── */}
      <div className="flex gap-[2px] bg-deep border border-border rounded p-[2px] flex-shrink-0">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => setActiveMode(m)}
            className="font-dis font-semibold rounded-[3px] border-none cursor-pointer transition-all duration-150 whitespace-nowrap"
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              padding: '4px 12px',
              background: activeMode === m ? '#00CCFF' : 'transparent',
              color: activeMode === m ? '#05080F' : '#4E6480',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── Live Indicator ── */}
      <div className="flex items-center gap-[6px] mx-4 flex-shrink-0">
        <div
          className="rounded-full flex-shrink-0"
          style={{
            width: 7,
            height: 7,
            background: '#00F080',
            animation: 'pulse-live 2.2s ease-in-out infinite',
          }}
        />
        <span
          className="font-dis font-bold text-live"
          style={{ fontSize: 11, letterSpacing: '0.18em' }}
        >
          LIVE
        </span>
      </div>

      {/* ── DEFCON Widget ── */}
      <div
        className="flex items-center gap-[10px] rounded flex-shrink-0 mx-2 relative overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          padding: '6px 14px',
          background: `${defconColor}26`,
          border: `1px solid ${defconColor}59`,
        }}
      >
        {/* Glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${defconColor}1F 0%, transparent 70%)`,
            animation: 'defconGlo 3.5s ease-in-out infinite alternate',
          }}
        />
        <div className="relative">
          <div
            className="font-dis font-semibold text-txt-3 uppercase"
            style={{ fontSize: 9, letterSpacing: '0.25em' }}
          >
            DEFCON
          </div>
          <div className="flex items-baseline gap-[5px]">
            <div
              className="font-dis font-bold"
              style={{
                fontSize: 26,
                lineHeight: 1,
                color: defconColor,
                animation: 'defconNum 4s ease-in-out infinite',
              }}
            >
              {defcon}
            </div>
            <div className="font-mon" style={{ fontSize: 10, color: `${defconColor}99` }}>
              {defconPct > 0 ? `${defconPct}%` : '—'}
            </div>
          </div>
        </div>
        {/* Animated SVG ring */}
        <div className="flex-shrink-0 relative" style={{ width: 36, height: 36 }}>
          <svg viewBox="0 0 36 36" width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
            {/* Track */}
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={`${defconColor}26`}
              strokeWidth="2.5"
            />
            {/* Main arc — clockwise, fill = globalScore % */}
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={`${defconColor}B3`}
              strokeWidth="2.5"
              strokeDasharray={`${defconPct} ${100 - defconPct}`}
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Secondary arc — counter-clockwise */}
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke={`${defconColor}4D`}
              strokeWidth="1.5"
              strokeDasharray="20 80"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 18 18"
                to="0 18 18"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* ── Digest Button ── */}
      <button
        onClick={() => setDigestOpen(!digestOpen)}
        className="flex items-center gap-[5px] rounded border cursor-pointer transition-all duration-200 flex-shrink-0 mx-1"
        style={{
          padding: '4px 12px',
          background:  digestOpen ? 'rgba(0,204,255,0.12)' : '#0C1422',
          borderColor: digestOpen ? '#00CCFF'              : '#1C2C42',
          color:       digestOpen ? '#00CCFF'              : '#8CA0BC',
        }}
      >
        <span style={{ fontSize: 12 }}>◉</span>
        <span className="font-dis font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
          Digest
        </span>
      </button>

      {/* ── Audio Toggle ── */}
      <button
        className="flex items-center gap-[4px] rounded border border-border cursor-pointer transition-all duration-150 flex-shrink-0 hover:border-acc"
        style={{ padding: '3px 8px', background: 'transparent' }}
      >
        <span style={{ fontSize: 11 }}>🔇</span>
        <span
          className="font-dis font-bold text-txt-3 uppercase"
          style={{ fontSize: 8, letterSpacing: '0.1em' }}
        >
          Audio
        </span>
      </button>

      {/* ── Region Selector ── */}
      <button
        className="flex items-center gap-[6px] bg-surface border border-border rounded font-dis font-semibold text-txt-2 cursor-pointer mx-[6px] flex-shrink-0 transition-all duration-150 hover:border-border-hi hover:text-txt-1"
        style={{ padding: '6px 12px', fontSize: 12, letterSpacing: '0.06em' }}
      >
        🌐&nbsp;Global&nbsp;▾
      </button>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Clock ── */}
      <div
        className="font-mon text-txt-3 flex-shrink-0 border-l border-border"
        style={{ fontSize: 10, letterSpacing: '0.06em', margin: '0 12px', paddingLeft: 12 }}
      >
        {clock}
      </div>

      {/* ── Search Trigger ── */}
      <button
        onClick={() => setSearchOpen(true)}
        className="flex items-center gap-2 bg-surface border border-border rounded text-txt-3 font-mon cursor-pointer whitespace-nowrap transition-all duration-200 flex-shrink-0 mr-2 hover:border-acc hover:text-acc"
        style={{ padding: '6px 12px', fontSize: 11 }}
      >
        <span>Search or command…</span>
        <span
          className="bg-raised rounded"
          style={{ padding: '1px 5px', fontSize: 9 }}
        >
          ⌘K
        </span>
      </button>

      {/* ── Action Buttons ── */}
      <div className="flex gap-1 flex-shrink-0">
        {/* Print */}
        <ActionBtn title="Print / Export PDF" style={{ fontSize: 11 }}>🖨</ActionBtn>

        {/* Multi-Monitor */}
        <ActionBtn title="Multi-Monitor" onClick={() => setMultiMonitorOpen(true)} className="relative">
          ⊞
          <div
            className="absolute -top-[2px] -right-[2px] rounded-full border-2 border-void"
            style={{ width: 8, height: 8, background: '#00CCFF' }}
          />
        </ActionBtn>

        {/* Notifications */}
        <ActionBtn title="Notifications" onClick={() => setNotificationsOpen(true)} className="relative">
          🔔
          <div
            className="absolute flex items-center justify-center rounded-full border-2 border-void font-mon font-semibold text-white"
            style={{
              top: -3, right: -3,
              width: 15, height: 15,
              background: '#FF2040',
              fontSize: 8,
            }}
          >
            3
          </div>
        </ActionBtn>

        <ActionBtn title="Clipboard">📋</ActionBtn>
        <ActionBtn title="Settings">⚙</ActionBtn>
        <ActionBtn title="Fullscreen">⛶</ActionBtn>
      </div>
    </header>
  );
}

// ── Shared action button ──────────────────────────────────────────────────────
interface ActionBtnProps {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

function ActionBtn({ children, title, onClick, className = '', style }: ActionBtnProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded border border-border bg-surface text-txt-3 flex items-center justify-center cursor-pointer text-[13px] transition-all duration-150 relative hover:border-border-hi hover:text-txt-1 hover:bg-raised ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
