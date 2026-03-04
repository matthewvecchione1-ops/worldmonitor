# W·I·M — Prototype Guide
## How wim-v3.html Maps to React Components

> **This document is for Claude Code.** It maps every section of the monolithic HTML prototype to its corresponding React component. Use this to understand what each part of the prototype should become.

---

## File Reference

**Prototype:** `prototype/wim-v3.html` (2,421 lines)
**Structure:** Single HTML file containing all CSS (lines 1-840), HTML (lines 841-1400), and JavaScript (lines 1401-2421)

---

## HTML → Component Mapping

### Shell

| Prototype Element | CSS Selector | Line Range | React Component | Notes |
|-------------------|-------------|------------|-----------------|-------|
| Root grid | `#shell` | ~841 | `AppShell.tsx` | CSS Grid: sidebar / main / rail |
| Top bar | `#topbar` | ~842-875 | `TopBar.tsx` | Fixed top, blur backdrop |
| Sidebar | `#sidebar` | ~877-892 | `Sidebar.tsx` | Icon nav with tooltips |
| Intel rail | `#intel-rail` | ~1380-1400 | `IntelRail.tsx` | Right sidebar |

### Level 1 — Command Surface

| Prototype Element | CSS Selector | Line Range | React Component |
|-------------------|-------------|------------|-----------------|
| Hero alert bar | `.hero-alert` | ~895-900 | `HeroAlert.tsx` |
| KPI strip | `.kpi-strip` | ~901-940 | `KPIStrip.tsx` + `KPICard.tsx` |
| Map wrapper | `#map-wrap` | ~942-980 | `GlobalMap.tsx` |
| Leaflet map | `#leaflet-map` | ~943 | Inside `GlobalMap.tsx` |
| Layer panel | `.layer-panel` | ~955-978 | `MapLayerPanel.tsx` |
| Context label | `.ctx-label` | ~982 | Inline in main layout |
| Panel grid | `.panel-row` | ~984-1100 | `PanelGrid.tsx` |
| Intel feed panel | First `.panel` | ~985-1020 | `IntelFeed.tsx` |
| Country instability | Second `.panel` | ~1021-1050 | `CountryInstability.tsx` |
| Markets panel | Third `.panel` | ~1051-1090 | `Markets.tsx` |
| World news panel | Fourth `.panel` | ~1091-1100 | `WorldNews.tsx` |
| Scroll hint | `.scroll-hint` | ~1102 | Inline or small component |

### Level 2 — Deep Intelligence

| Prototype Element | Line Range | React Component |
|-------------------|------------|-----------------|
| L2 header | ~1105 | Section header in main scroll |
| Infrastructure section | ~1108-1150 | `Infrastructure.tsx` |
| Financial section | ~1152-1200 | `FinancialIntel.tsx` |
| Military section | ~1202-1250 | `MilitaryDefense.tsx` |
| Cyber section | ~1252-1300 | `CyberThreat.tsx` |

### Level 3 — Investigation Canvas

| Prototype Element | Line Range | React Component |
|-------------------|------------|-----------------|
| L3 header | ~1305 | Section header |
| Entity graph | ~1310-1340 | `EntityGraph.tsx` (D3) |
| Detail panel | ~1342-1380 | `DetailPanel.tsx` |

### Overlays

| Prototype Element | CSS Selector | Line Range | React Component |
|-------------------|-------------|------------|-----------------|
| Country focus | `#country-focus` | ~1410-1580 | `CountryFocus.tsx` |
| Theater map | `#cf-leaflet-map` | ~1466 | `TheaterMap.tsx` |
| Digest overlay | `#digest-overlay` | ~1582-1640 | `DigestMode.tsx` |
| Analyst chat | `.analyst-chat` | Inside digest | `AnalystChat.tsx` |
| Search palette | `#cmd-palette` | ~1395-1408 | `SearchPalette.tsx` |
| Multi-monitor modal | `#mm-modal` | ~1385-1394 | `MultiMonitorManager.tsx` |

---

## CSS → Tailwind Mapping

The prototype uses CSS custom properties. Here's how key classes map to Tailwind:

| Prototype CSS | Tailwind Equivalent |
|---------------|-------------------|
| `background: var(--void)` | `bg-void` |
| `background: var(--deep)` | `bg-deep` |
| `color: var(--txt-1)` | `text-txt-1` |
| `color: var(--crit)` | `text-crit` |
| `border: 1px solid var(--border)` | `border border-border` |
| `border-radius: var(--rad)` | `rounded-wim` |
| `padding: var(--pad)` | `p-pad` (or `p-[14px]`) |
| `gap: var(--gap)` | `gap-gap` (or `gap-[6px]`) |
| `font-family: var(--f-dis)` | `font-dis` |
| `font-family: var(--f-mon)` | `font-mon` |

---

## JavaScript → React Mapping

### Global Map (Lines ~1644-1790)

The prototype's IIFE `(function(){ ... })()` containing the Leaflet initialization becomes `GlobalMap.tsx`:

- All carrier/base/submarine/aircraft/hostile data arrays → `useMapAssets()` hook
- Layer group management → `useMapStore()` + `MapLayerPanel.tsx`
- Popup HTML generation → `mapHelpers.ts` utility functions
- Click handlers → React event handlers
- ResizeObserver → `useEffect` with cleanup

### Theater Map (Lines ~2329-2460)

The `initTheaterMap()` function becomes `TheaterMap.tsx`:

- Separate Leaflet instance
- Takes `assets: MapAsset[]` as prop from parent `CountryFocus.tsx`
- Initializes on mount, destroys on unmount

### Clock (Lines ~1790-1800)

Simple `setInterval` → `useEffect` in `TopBar.tsx`

### Country Focus Toggle (Lines ~1800-1860)

`window.openCountryFocus()` / `window.closeCountryFocus()` → `useFocusStore()` Zustand store

### Multi-Monitor Sync (Lines ~1860-1950)

`BroadcastChannel` code → `src/lib/broadcast.ts` utility

### Digest Mode Toggle (Lines ~1960-2050)

Toggle logic → state in `DigestMode.tsx` or `useLayoutStore()`

### Ambient Audio (Lines ~2050-2100)

Web Audio API code → `src/lib/audio.ts` utility + `useAudioStore()`

### Search Palette (Lines ~2100-2200)

Command palette logic → `SearchPalette.tsx` with `useSearch()` hook

---

## Data Currently Hardcoded (Must Come From API)

These are all the places where the prototype has fake/static data that needs to be replaced with API calls:

| Data | Prototype Location | API Endpoint |
|------|--------------------|-------------|
| KPI values (78, 247, 14...) | HTML ~901-940 | `GET /api/kpi/summary` |
| Hero alert text | HTML ~895-900 | `GET /api/alerts/hero` |
| Carrier positions (lat/lng) | JS ~1660-1680 | `GET /api/map/assets` |
| Base positions | JS ~1682-1700 | `GET /api/map/assets` |
| All other map assets | JS ~1700-1780 | `GET /api/map/assets` |
| Shipping routes | JS ~route arrays | `GET /api/map/routes` |
| Missile ranges | JS ~missile arrays | `GET /api/map/zones` |
| Intel feed headlines | HTML ~985-1020 | `GET /api/intel/feed` |
| Country scores (Iran 92...) | HTML ~1021-1050 | `GET /api/countries/instability` |
| Market tickers | HTML ~1051-1090 | `GET /api/markets/summary` |
| World news headlines | HTML ~1091-1100 | `GET /api/news/feed` |
| Country dossier (Iran) | HTML ~1410-1580 | `GET /api/countries/iran/dossier` |
| Theater map assets | JS ~2340-2440 | Part of dossier endpoint |
| Digest mode content | HTML ~1582-1640 | `GET /api/digest/current` |
| Analyst chat responses | JS ~2000-2050 | `POST /api/analyst/ask` |
| Intel rail signals | HTML ~1380-1400 | `GET /api/signals/trending` |
| L2 section content | HTML ~1108-1300 | `GET /api/intel/deep` |
| L3 entity graph | HTML ~1310-1340 | `GET /api/graph/entity/{id}` |

---

## Visual Reference Priority

When building each component, the prototype is the visual source of truth. Match these exactly:

1. **Colors** — Use the exact hex values from the design system
2. **Typography** — Font family, weight, size, letter-spacing, text-transform
3. **Spacing** — Padding, margins, gaps between elements
4. **Borders** — 1px solid, correct border color from hierarchy
5. **Animations** — Pulse rings on markers, feed item entrance, live dot blinking
6. **Hover states** — Border glow, background shift one level up
7. **Popup styling** — Dark background, correct fonts, status badges

**Open the prototype in a browser side-by-side with your React app and pixel-match.**

---

*This guide should make it possible for Claude Code to look at any part of the prototype, find the corresponding spec in this doc, and build the React equivalent.*
