import { useState, useEffect, useRef, useMemo } from 'react';
import { useLayoutStore } from '../../stores/useLayoutStore';
import { useFocusStore } from '../../stores/useFocusStore';

// ── Types ──────────────────────────────────────────────────────────────────

type ResultType = 'country' | 'entity' | 'signal';

interface SearchResult {
  type: ResultType;
  id: string;
  name: string;
  subtitle: string;
  icon: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const ALL_RESULTS: SearchResult[] = [
  { type: 'country', id: 'iran',      name: 'Iran',                      subtitle: 'Risk: 92 · CRITICAL',           icon: '🇮🇷' },
  { type: 'country', id: 'iraq',      name: 'Iraq',                      subtitle: 'Risk: 45 · MODERATE',           icon: '🇮🇶' },
  { type: 'entity',  id: 'irgc',      name: 'IRGC',                      subtitle: 'Military Organization · Iran',  icon: '⚔' },
  { type: 'entity',  id: 'hezbollah', name: 'Hezbollah',                 subtitle: 'Proxy · Lebanon',               icon: '🎯' },
  { type: 'signal',  id: 's1',        name: 'IRGC at maximum readiness', subtitle: '2h ago · CRITICAL',             icon: '⚡' },
  { type: 'signal',  id: 's2',        name: 'Oil surges past $67',       subtitle: '6h ago · HIGH',                 icon: '📊' },
];

const SECTION_LABELS: Record<ResultType, string> = {
  country: 'Countries',
  entity:  'Entities',
  signal:  'Signals',
};

const SECTION_ORDER: ResultType[] = ['country', 'entity', 'signal'];

// ── Component ─────────────────────────────────────────────────────────────

export default function SearchPalette() {
  const { setSearchOpen } = useLayoutStore();
  const { openCountryFocus } = useFocusStore();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter results by query
  const filtered = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_RESULTS;
    return ALL_RESULTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q),
    );
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [filtered]);

  // Group filtered results by type
  const grouped = useMemo(() => {
    const map: Partial<Record<ResultType, SearchResult[]>> = {};
    for (const r of filtered) {
      if (!map[r.type]) map[r.type] = [];
      map[r.type]!.push(r);
    }
    return map;
  }, [filtered]);

  // Flat ordered list for keyboard navigation index
  const flatList = useMemo<SearchResult[]>(() => {
    const list: SearchResult[] = [];
    for (const type of SECTION_ORDER) {
      if (grouped[type]) list.push(...grouped[type]!);
    }
    return list;
  }, [grouped]);

  // Keyboard: Escape, ArrowUp, ArrowDown, Enter
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setSearchOpen(false);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatList[activeIndex];
        if (item) {
          if (item.type === 'country') openCountryFocus(item.id);
          setSearchOpen(false);
        }
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [flatList, activeIndex, setSearchOpen, openCountryFocus]);

  function handleSelect(item: SearchResult) {
    if (item.type === 'country') openCountryFocus(item.id);
    setSearchOpen(false);
  }

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(5,8,15,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '14vh',
        animation: 'spFadeIn 150ms ease-out',
      }}
      onClick={() => setSearchOpen(false)}
    >
      {/* Palette panel */}
      <div
        style={{
          width: 600,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '60vh',
          background: '#080D18',
          border: '1px solid #2E4A6A',
          borderRadius: 8,
          boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'spSlideDown 150ms cubic-bezier(0.22,1,0.36,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Search input row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            borderBottom: '1px solid #1C2C42',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 15, color: '#4E6480', flexShrink: 0 }}>⌕</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries, entities, signals, or type a command…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 15,
              color: '#ECF0F8',
            }}
          />
          <kbd
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              color: '#4E6480',
              background: '#0C1422',
              border: '1px solid #1C2C42',
              borderRadius: 3,
              padding: '2px 6px',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={() => setSearchOpen(false)}
          >
            ESC
          </kbd>
        </div>

        {/* ── Results list ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#1C2C42 transparent',
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '28px 16px',
                textAlign: 'center',
                fontSize: 12,
                color: '#4E6480',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            SECTION_ORDER.map((type) => {
              const items = grouped[type];
              if (!items?.length) return null;
              return (
                <div key={type}>
                  {/* Section label */}
                  <div
                    style={{
                      padding: '8px 16px 3px',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 700,
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      color: '#2A3C52',
                      textTransform: 'uppercase',
                    }}
                  >
                    {SECTION_LABELS[type]}
                  </div>

                  {/* Result rows */}
                  {items.map((item) => {
                    const flatIdx = flatList.indexOf(item);
                    const isActive = flatIdx === activeIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '7px 16px',
                          background: isActive ? 'rgba(0,204,255,0.07)' : 'transparent',
                          borderLeft: `2px solid ${isActive ? '#00CCFF' : 'transparent'}`,
                          cursor: 'pointer',
                          transition: 'background 80ms',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 17,
                            width: 24,
                            textAlign: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: isActive ? '#ECF0F8' : '#A8BBD0',
                              fontFamily: 'DM Sans, sans-serif',
                            }}
                          >
                            {item.name}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: '#4E6480',
                              fontFamily: 'JetBrains Mono, monospace',
                              marginTop: 1,
                            }}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                        {isActive && (
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: 8,
                              color: '#4E6480',
                              background: '#0C1422',
                              border: '1px solid #1C2C42',
                              borderRadius: 3,
                              padding: '2px 6px',
                              flexShrink: 0,
                              letterSpacing: '0.05em',
                            }}
                          >
                            ↵ SELECT
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer hints ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '6px 16px',
            borderTop: '1px solid #1C2C42',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#2A3C52',
            flexShrink: 0,
          }}
        >
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
          <div style={{ flex: 1 }} />
          <span>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
