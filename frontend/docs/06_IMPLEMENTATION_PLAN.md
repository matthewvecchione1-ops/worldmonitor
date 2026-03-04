# W·I·M — Implementation Plan
## Phased Build Order for Claude Code / Development Team

> **Read this after the Project Bible and Tech Stack.** This document tells you exactly what to build, in what order, and what "done" looks like at each phase.

---

## Phase 0: Project Scaffolding
**Goal:** Empty React app that runs, with all tools configured.
**Time estimate:** 1-2 hours

### Tasks:
1. Create `frontend/` directory inside the repo
2. `npm create vite@latest . -- --template react-ts`
3. Install all dependencies from Tech Stack doc
4. Configure Tailwind with design tokens from 04_DESIGN_SYSTEM.md
5. Create folder structure from 05_TECH_STACK.md
6. Create all TypeScript interfaces in `src/types/` from 03_DATA_CONTRACTS.md
7. Create placeholder components (empty files with correct exports)
8. Create `src/lib/api.ts` with base fetch wrapper
9. Create `.env` with placeholder URLs
10. Verify: `npm run dev` shows a blank dark page, `npm run typecheck` passes

### Definition of Done:
- `npm run dev` works
- Tailwind renders custom colors correctly
- All type files compile
- Folder structure matches spec

---

## Phase 1: Shell & Layout
**Goal:** The app container with TopBar, Sidebar, and responsive grid.
**Time estimate:** 3-4 hours

### Tasks:
1. Build `AppShell.tsx` — CSS Grid layout matching prototype
2. Build `TopBar.tsx` — logo, mode pills (non-functional), DEFCON ring (static), clock (live), search trigger (opens empty modal)
3. Build `Sidebar.tsx` — icon navigation with tooltips, active state
4. Build `IntelRail.tsx` — placeholder content, correct width
5. Implement `useLayoutStore.ts` — tracks active role, sidebar/rail visibility
6. Test responsive behavior: sidebar collapses on small screens
7. Match visual output to wim-v3.html prototype header and layout

### Definition of Done:
- App shows dark shell with TopBar, Sidebar, scrollable main area, Intel Rail
- Clock updates every second showing UTC time
- Sidebar icons have hover tooltips
- Layout grid matches prototype proportions

---

## Phase 2: KPI Strip & Hero Alert
**Goal:** First data-driven components with mock data, then API integration.
**Time estimate:** 2-3 hours

### Tasks:
1. Build `KPICard.tsx` — single KPI display component
2. Build `KPIStrip.tsx` — 6-card row with primary card wider (1.6fr)
3. Build `HeroAlert.tsx` — dismissible alert bar with severity styling
4. Create `useKPIs.ts` hook — initially returns hardcoded data matching prototype
5. Create `useHeroAlert.ts` hook — initially returns hardcoded data
6. Wire hooks to components
7. Style to match prototype exactly

### Definition of Done:
- KPI strip shows 6 metrics with Global Risk Score visually larger
- Hero alert bar shows with red accent, ✕ to dismiss, click for action
- Change indicators show +/- with correct colors
- Context line appears under primary KPI

---

## Phase 3: Global Map (THE BIG ONE)
**Goal:** Full interactive Leaflet map with all military/intelligence layers.
**Time estimate:** 6-8 hours

### Tasks:
1. Build `GlobalMap.tsx` — Leaflet initialization with dark tiles
2. Create `src/lib/mapHelpers.ts`:
   - `createMarkerIcon(type, color, size)` — generates divIcon HTML
   - `createPopupContent(title, detail, status, statusColor)` — generates popup HTML
   - `createPulseIcon(color, size)` — pulsing marker
3. Build `MapLayerPanel.tsx` — toggle checkboxes linked to Leaflet layer groups
4. Create `useMapAssets.ts` hook — initially returns hardcoded asset data from prototype
5. Create `useMapStore.ts` — tracks layer visibility, map center, zoom
6. Implement all layer groups:
   - Carrier Strike Groups (blue pulsing circles)
   - US/Allied Bases (blue squares)
   - Submarine Patrols (dashed circles)
   - Aircraft/ISR (purple triangles)
   - Hostile Forces (red pulsing diamonds)
   - Nuclear Sites (yellow pulsing circles)
   - Proxy Forces (orange triangles)
   - Shipping Routes (dashed polylines with color coding)
   - Missile Ranges (concentric circles from Iran)
   - Closed Airspace (dashed polygons)
   - Chokepoints (diamonds with status)
7. Implement click handlers: click country area → open dossier
8. Apply Leaflet dark theme CSS overrides
9. Add ResizeObserver for responsive map sizing
10. Test: zoom, pan, layer toggles, popups, click-through

### Definition of Done:
- Map renders with dark CartoDB tiles
- All 10 layer types visible with correct icons
- Layer panel toggles layers on/off
- Every marker has a clickable popup with rich detail
- Missile ranges show concentric circles
- Shipping routes show with correct colors and dash patterns
- Map is responsive and doesn't break on resize

---

## Phase 4: Panel Grid (Intel Feed, Countries, Markets, News)
**Goal:** Four live data panels below the map.
**Time estimate:** 4-5 hours

### Tasks:
1. Build `PanelGrid.tsx` — 4-column responsive grid
2. Build `IntelFeed.tsx` — scrollable feed with source tags, severity badges, timestamps
3. Build `CountryInstability.tsx` — ranked bar chart with click → dossier
4. Build `Markets.tsx` — ticker grid with sector heatmap
5. Build `WorldNews.tsx` — news feed similar to intel feed
6. Create hooks: `useIntelFeed.ts`, `useCountries.ts`, `useMarkets.ts`
7. Initially populate with hardcoded data matching prototype
8. Add feed item entrance animation (slide in from top)

### Definition of Done:
- Four panels render in a row below the map
- Intel feed shows headlines with source tags and severity badges
- Country list shows horizontal bars with scores and trend arrows
- Market panel shows tickers with +/- colors and sector heatmap
- Click a country in the instability list → triggers dossier open

---

## Phase 5: Country Focus Dossier
**Goal:** Full-screen country overlay with theater map.
**Time estimate:** 5-6 hours

### Tasks:
1. Build `CountryFocus.tsx` — overlay container with header, back button, risk badge
2. Build `TheaterMap.tsx` — second Leaflet instance for zoomed country view
3. Build dossier sections: CurrentSituation, KeyStats, RelatedEntities, Timeline, Financial, Predictions, MilitaryPosture
4. Create `useCountryDossier.ts` hook
5. Create `useFocusStore.ts` — tracks which country is open
6. Wire map click → open dossier
7. Wire country list click → open dossier
8. Add ESC key to close
9. Populate theater map with country-specific assets

### Definition of Done:
- Clicking Iran on map or country list opens full-screen Iran dossier
- Header shows country name, risk score badge
- Theater map shows zoomed view with strike sites, bases, nuclear facilities
- All dossier sections render with formatted data
- Back button and ESC close the overlay
- Scroll works within the dossier

---

## Phase 6: Digest Mode
**Goal:** Narrative intelligence overlay with temporal triage and story arcs.
**Time estimate:** 3-4 hours

### Tasks:
1. Build `DigestMode.tsx` — full-screen overlay
2. Build sections: ThreatSummary, TemporalTriage, StoryArcs, WatchList
3. Build `AnalystChat.tsx` — text input with typewriter response effect
4. Create `useDigest.ts` hook
5. Wire Digest button in TopBar
6. Add ESC to close

### Definition of Done:
- Digest button opens narrative overlay
- Past/Now/Next columns show with probability scores
- Story arcs show causal chains with "So What?" boxes
- Analyst chat accepts input and shows typewriter response (hardcoded initially)

---

## Phase 7: Backend Integration
**Goal:** Replace all hardcoded data with real API calls.
**Time estimate:** Variable — depends on backend readiness

### Tasks:
1. Update `src/lib/api.ts` with real API base URL
2. Update each hook to call real endpoints
3. Add error states and loading skeletons to every component
4. Add TanStack Query cache configuration (stale times, refetch intervals)
5. Test with real data — fix any shape mismatches between expected and actual JSON

### Definition of Done:
- Every component fetches from real API
- Loading skeletons show during fetch
- Error states show gracefully (not blank screens)
- Data refreshes at configured intervals

---

## Phase 8: WebSocket Real-Time Layer
**Goal:** Live updates without polling.
**Time estimate:** 3-4 hours

### Tasks:
1. Build `src/lib/ws.ts` — WebSocket client with auto-reconnect
2. Build `useWebSocket.ts` hook — connects on mount, pumps events into TanStack Query cache
3. Handle events: `alert:hero`, `intel:new`, `market:tick`, `country:score`, `signal:new`, `kpi:update`
4. New intel items animate into the feed
5. Market ticks update in real-time (flash green/red like Bloomberg)
6. Test disconnect/reconnect behavior

### Definition of Done:
- WebSocket connects on app load
- New intel items appear without page refresh
- Market prices update live with flash animation
- Alert banner updates when new critical event occurs
- Connection survives network interruptions

---

## Phase 9: AI Analyst Integration
**Goal:** Working Claude/Grok-powered analyst chat.
**Time estimate:** 3-4 hours (frontend + backend endpoint)

### Tasks:
1. Build `POST /api/analyst/ask` backend endpoint (see 07_AI_INTEGRATION.md)
2. Update `useAnalyst.ts` hook to call real endpoint
3. Implement SSE or WebSocket streaming for typewriter effect
4. Build context injection — include current threat level, active signals, focused country in the prompt
5. Test with various question types

### Definition of Done:
- User types question in analyst chat
- Response streams in with typewriter effect
- Responses are context-aware (know about current Iran crisis, market data, etc.)
- Rate limiting prevents abuse

---

## Phase 10: Polish & Production
**Goal:** Production-ready application.
**Time estimate:** 4-6 hours

### Tasks:
1. Multi-monitor BroadcastChannel sync
2. Keyboard shortcuts (⌘K search, ESC close, arrow navigation)
3. Ambient audio system (Web Audio API)
4. Print/PDF export
5. Performance: virtualized lists for feeds, debounced map renders
6. Accessibility: ARIA labels, focus management, color contrast
7. Error boundaries around every component
8. Production build optimization
9. Deployment configuration

### Definition of Done:
- App is production-built and deployable
- All features work across Chrome, Firefox, Safari
- No console errors
- Page loads in under 2 seconds
- Multi-monitor sync works

---

## Milestone Summary

| Phase | Deliverable | Cumulative % |
|-------|------------|-------------|
| 0 | Scaffolded project | 5% |
| 1 | Shell & layout | 15% |
| 2 | KPIs & alerts | 20% |
| 3 | Global map | 40% |
| 4 | Panel grid | 55% |
| 5 | Country dossier | 70% |
| 6 | Digest mode | 78% |
| 7 | Backend integration | 88% |
| 8 | WebSocket | 93% |
| 9 | AI analyst | 97% |
| 10 | Polish | 100% |

---

*Each phase should be a PR or set of commits. Claude Code should be able to execute phases 0-6 with just the prototype and these docs. Phases 7+ require the backend to be ready.*
