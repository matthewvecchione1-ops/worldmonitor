import { useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
}

const TOP_ITEMS: NavItem[] = [
  { icon: '⬡', label: 'Dashboard' },
  { icon: '◎', label: 'Map' },
  { icon: '▲', label: 'Alerts' },
  { icon: '◈', label: 'Intel Feeds' },
  { icon: '◉', label: 'Briefings' },
  { icon: '★', label: 'Watchlist' },
  { icon: '⬙', label: 'Investigations' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { icon: '⊕', label: 'Data Sources' },
  { icon: '≡', label: 'Settings' },
];

export default function Sidebar() {
  const [active, setActive] = useState('Dashboard');

  return (
    <aside
      className="flex flex-col items-center py-[10px] gap-[2px] z-[100] relative"
      style={{
        background: 'rgba(5,8,15,0.98)',
        borderRight: '1px solid #1C2C42',
      }}
    >
      {/* Accent gradient line on right edge */}
      <div
        className="absolute top-0 right-0 w-px h-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(0,204,255,0.2) 40%, transparent)',
        }}
      />

      {/* Top navigation items */}
      {TOP_ITEMS.map((item) => (
        <NavBtn
          key={item.label}
          item={item}
          isActive={active === item.label}
          onClick={() => setActive(item.label)}
        />
      ))}

      {/* Separator */}
      <div className="w-6 h-px bg-border my-[6px] flex-shrink-0" />

      {/* Spacer pushes bottom items down */}
      <div className="flex-1" />

      {/* Bottom items */}
      {BOTTOM_ITEMS.map((item) => (
        <NavBtn
          key={item.label}
          item={item}
          isActive={active === item.label}
          onClick={() => setActive(item.label)}
        />
      ))}
    </aside>
  );
}

// ── Individual nav button ─────────────────────────────────────────────────────
interface NavBtnProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavBtn({ item, isActive, onClick }: NavBtnProps) {
  return (
    <div
      onClick={onClick}
      title={item.label}
      className="relative flex items-center justify-center flex-shrink-0 rounded-[6px] cursor-pointer transition-all duration-200 group"
      style={{
        width: 38,
        height: 38,
        fontSize: 15,
        background: isActive ? 'rgba(0,204,255,0.1)' : 'transparent',
        color: isActive ? '#00CCFF' : '#4E6480',
        boxShadow: isActive ? 'inset 0 0 0 1px rgba(0,204,255,0.25)' : 'none',
      }}
    >
      {/* Active left accent bar */}
      {isActive && (
        <div
          className="absolute rounded-[0_2px_2px_0]"
          style={{
            left: -1,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 2,
            height: 18,
            background: '#00CCFF',
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          color: isActive ? '#00CCFF' : '#4E6480',
          transition: 'color 200ms',
        }}
        className="group-hover:!text-txt-2"
      >
        {item.icon}
      </span>

      {/* Tooltip */}
      <div
        className="absolute pointer-events-none z-[999] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }}
      >
        <div
          className="bg-elevated border border-border-hi text-txt-1 font-dis font-semibold uppercase whitespace-nowrap rounded-[3px]"
          style={{ fontSize: 11, letterSpacing: '0.08em', padding: '4px 10px' }}
        >
          {item.label}
        </div>
      </div>
    </div>
  );
}
