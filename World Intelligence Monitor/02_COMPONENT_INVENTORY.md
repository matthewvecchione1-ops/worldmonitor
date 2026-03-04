# W·I·M — Component Inventory
## Every UI Component, Its Data Needs, and Behavior

> **For developers:** Each component below maps to a React component. The `Data Shape` section defines the TypeScript interface. The `Source` field tells you which API endpoint feeds it. The `Prototype Reference` tells you where to find it in wim-v3.html.

---

## Shell / Layout Components

### 1. AppShell
**Purpose:** Root layout grid — sidebar, main content, intel rail.
**Behavior:** CSS Grid. Columns change based on active multi-monitor role. Sidebar and rail can be hidden.
**State:** `activeRole: 'default' | 'command' | 'intel' | 'markets' | 'ops' | 'analyst' | 'all'`
**Prototype Reference:** `#shell` (grid-template-columns: var(--sb-w) 1fr var(--rail-w))

### 2. TopBar
**Purpose:** Primary navigation bar — logo, mode pills, DEFCON indicator, controls, clock, search.
**Children:** ModePills, DefconIndicator, DigestButton, AudioToggle, OperationsButton, RegionSelector, Clock, SearchTrigger, ActionButtons
**Behavior:** Fixed top. Always visible. Blur backdrop.
**Prototype Reference:** `#topbar`

### 3. Sidebar
**Purpose:** Left icon navigation — primary section switching.
**Items:** Dashboard, Map, Alerts, Intel Feeds, Briefings, Watchlist, Investigations, Data Sources, Settings
**Behavior:** Icon-only, tooltip on hover. Active state indicator. Hidden in COMMAND and ALL roles.
**Prototype Reference:** `#sidebar`

### 4. IntelRail
**Purpose:** Right-side intelligence sidebar — trending signals, active alerts, watchlist.
**Sections:** Trending Signals (scrolling ticker), Active Alerts (severity-sorted), Quick Watchlist
**Behavior:** Hidden in COMMAND and ALL roles. Collapsible.
**Data Shape:**
```typescript
interface TrendingSignal {
  id: string;
  text: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  timestamp: string;
  source: string;
}
```
**Prototype Reference:** `#intel-rail`

---

## Level 1 — Command Surface

### 5. HeroAlert
**Purpose:** Single most critical event in plain English. Red accent bar.
**Behavior:** Dismissible (✕). Clickable → opens relevant country dossier. Shows probability score on right side. Pulses gently to draw attention without being annoying.
**Data Shape:**
```typescript
interface HeroAlert {
  id: string;
  severity: 'critical' | 'high';
  headline: string;       // "Iran Crisis — Day 2: IRGC at maximum readiness..."
  probability: number;    // 0.94
  probabilityLabel: string; // "retaliatory strike"
  countryId: string;      // "iran" — for click-through
  timestamp: string;
}
```
**Source:** `GET /api/alerts/hero` or WebSocket push
**Refresh:** Real-time (WebSocket)
**Prototype Reference:** `.hero-alert`

### 6. KPIStrip
**Purpose:** Row of 6 key performance indicators. Global Risk Score is 1.6x wider.
**Behavior:** Static display with 24h change indicators. Context line under primary KPI explains WHY the number is what it is.
**Data Shape:**
```typescript
interface KPI {
  label: string;           // "Global Risk Score"
  value: number | string;  // 78
  change: number;          // +12
  changePeriod: string;    // "24h"
  context?: string;        // "Highest since Feb 2022 Ukraine invasion..."
  isPrimary?: boolean;     // true for Global Risk Score
}
```
**Source:** `GET /api/kpi/summary`
**Refresh:** Every 60 seconds or WebSocket push
**Prototype Reference:** `.kpi-strip`

### 7. GlobalMap (Leaflet)
**Purpose:** Interactive world map showing military assets, shipping routes, conflict zones, chokepoints, missile ranges, closed airspace.
**This is the most complex component.** See dedicated section below.
**Behavior:** Pan, zoom, click markers for popups, click country for dossier. Layer toggles in sidebar panel.
**Prototype Reference:** `#leaflet-map` + `#map-wrap`

#### 7a. MapLayerPanel
**Purpose:** Toggle visibility of map data layers.
**Layers:** US Carrier Groups, US/Allied Bases, Submarine Patrols, Aircraft/ISR, Hostile Forces, Proxy Forces, Nuclear Sites, Shipping Routes, Missile Ranges, Closed Airspace
**Behavior:** Checkbox toggles. Layer visibility persisted in localStorage.
**Prototype Reference:** `.layer-panel`

#### 7b. MapMarker (per type)
Each marker type has a distinct visual and popup:

| Type | Visual | Popup Content |
|------|--------|--------------|
| Carrier Strike Group | Blue pulsing circle | Ship name, hull number, escorts, air wing, status |
| US/Allied Base | Blue square | Base name, location, deployed assets, capabilities |
| Submarine Patrol | Dashed blue circle area | Class, capability, patrol area |
| Aircraft | Purple triangle | Type, origin, mission, payload |
| Hostile Force | Red pulsing diamond | Unit name, location, activity, threat level |
| Nuclear Site | Yellow pulsing circle | Facility name, type, enrichment level, strike status |
| Proxy Force | Orange triangle | Group name, location, capabilities, allegiance |
| Chokepoint | Diamond | Name, status, ship count, % world trade |

**Data Shape:**
```typescript
interface MapAsset {
  id: string;
  lat: number;
  lng: number;
  type: 'carrier' | 'base' | 'submarine' | 'aircraft' | 'hostile' | 'nuclear' | 'proxy' | 'chokepoint';
  name: string;
  detail: string;        // HTML-safe detail text
  status: string;        // "COMBAT READY", "STRUCK", "ACTIVE THREAT"
  statusColor: string;   // hex color for status badge
  heading?: number;      // degrees, for carriers/aircraft
  range?: number;        // meters, for submarine patrol areas
}

interface ShippingRoute {
  id: string;
  points: [number, number][];  // [lat, lng] pairs
  color: string;
  label: string;
  type: 'tanker' | 'reroute' | 'navy' | 'contested';
}

interface MissileRange {
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  label: string;         // "Shahab-3 · 1,300 km"
}

interface AirspaceZone {
  polygon: [number, number][];
  label: string;
  status: 'closed' | 'restricted';
}
```
**Source:** `GET /api/map/assets`, `GET /api/map/routes`, `GET /api/map/zones`
**Refresh:** Every 30 seconds for asset positions, every 5 minutes for routes/zones

### 8. PanelGrid
**Purpose:** Four-column grid of live data panels below the map.
**Children:** IntelFeed, CountryInstability, Markets, WorldNews

#### 8a. IntelFeed
**Purpose:** Live intelligence headlines ranked by relevance.
**Behavior:** Scrollable list. New items animate in at top. Each item has source tag, severity badge, timestamp, headline. Click → expand or open source.
**Data Shape:**
```typescript
interface IntelItem {
  id: string;
  source: string;        // "The War Zone", "BBC World"
  headline: string;
  severity: 'alert' | 'breaking' | 'standard';
  tags: string[];        // ["MILITARY", "CONFLICT", "CYBER"]
  timestamp: string;
  url?: string;
  relatedCountry?: string;
}
```
**Source:** `GET /api/intel/feed?limit=50`
**Refresh:** WebSocket push for new items
**Prototype Reference:** First `.panel` in panel grid

#### 8b. CountryInstability
**Purpose:** Ranked list of countries by composite instability index.
**Behavior:** Horizontal bar chart. Color gradient from green (stable) to red (critical). Click country → open dossier. Arrow indicator for trend direction.
**Data Shape:**
```typescript
interface CountryScore {
  id: string;            // "iran"
  name: string;          // "Iran"
  score: number;         // 0-100
  change: number;        // +18
  trend: 'up' | 'down' | 'stable';
}
```
**Source:** `GET /api/countries/instability?limit=20`
**Refresh:** Every 60 seconds
**Prototype Reference:** Second `.panel`

#### 8c. Markets
**Purpose:** Financial market data — equities, commodities, crypto, VIX. Plus sector heatmap.
**Data Shape:**
```typescript
interface MarketTick {
  ticker: string;        // "AAPL"
  price: number;
  change: number;        // percentage
  category: 'equity' | 'commodity' | 'crypto' | 'index';
}
interface SectorPerf {
  name: string;          // "Tech"
  change: number;        // -1.6
}
```
**Source:** `GET /api/markets/summary`
**Refresh:** WebSocket for live ticks, or poll every 15 seconds
**Prototype Reference:** Third `.panel`

#### 8d. WorldNews
**Purpose:** Curated world news headlines from major outlets.
**Data Shape:** Same as IntelItem but filtered to news sources.
**Source:** `GET /api/news/feed?limit=20`
**Prototype Reference:** Fourth `.panel`

---

## Level 2 — Deep Intelligence

### 9. L2Section (repeated pattern)
Each L2 section follows the same card layout pattern:

#### 9a. InfrastructureSupplyChain
Cards: Critical Chokepoints, Energy Infrastructure, Supply Chain Disruptions, Shipping & Logistics

#### 9b. FinancialIntelligence
Cards: Sanctions Tracker, Trade Flow Impact, Currency Stress, Energy Markets Deep Dive

#### 9c. MilitaryDefense
Cards: Force Posture Map, Weapons Systems Tracked, Alliance Activity, Arms Transfers

#### 9d. CyberThreat
Cards: Active Campaigns, Threat Actor Profiles, Vulnerability Landscape, Attribution Confidence

**Data Shape (generic card):**
```typescript
interface IntelCard {
  id: string;
  title: string;
  domain: 'infrastructure' | 'financial' | 'military' | 'cyber';
  content: CardContent[];  // flexible content blocks
  severity: string;
  lastUpdated: string;
}
```
**Source:** `GET /api/intel/deep?domain={domain}`

---

## Level 3 — Investigation Canvas

### 10. EntityGraph
**Purpose:** D3-based force-directed graph showing entity relationships.
**Behavior:** Drag nodes, click to expand connections, right-click for context menu. Color-coded by entity type.
**Data Shape:**
```typescript
interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'organization' | 'location' | 'event' | 'weapon' | 'facility';
  risk: number;
  connections: number;
}
interface GraphEdge {
  source: string;
  target: string;
  relationship: string;   // "commands", "funds", "located_at"
  strength: number;        // 0-1
}
```
**Source:** `GET /api/graph/entity/{id}?depth=2`

### 11. DetailPanel
**Purpose:** Right-side panel showing selected entity details.
**Behavior:** Opens when a graph node or feed item is selected. Shows structured profile, timeline, connections, notes.
**Prototype Reference:** `.detail-panel` in L3 section

---

## Overlay Components

### 12. CountryFocusDossier
**Purpose:** Full-screen overlay with comprehensive country intelligence.
**Sections:**
- Header (country name, flag, risk score, region, population)
- Theater Map (Leaflet instance focused on the country)
- Current Situation (prose summary)
- Key Statistics (table of risk metrics)
- Related Entities (linked actors, facilities, groups)
- Event Timeline (last 48h chronological events)
- Financial & Economic Impact (markets, sanctions, trade)
- Predictive Signals (probability-scored forecasts)
- Military & Intelligence Posture (force disposition)

**Data Shape:**
```typescript
interface CountryDossier {
  id: string;
  name: string;
  officialName: string;
  region: string;
  population: string;
  riskScore: number;
  riskChange: number;
  riskLevel: 'critical' | 'high' | 'elevated' | 'moderate' | 'low';
  situation: string;       // prose summary
  stats: CountryStatRow[];
  entities: RelatedEntity[];
  timeline: TimelineEvent[];
  financial: FinancialImpact;
  predictions: Prediction[];
  military: MilitaryPosture;
  theaterAssets: MapAsset[];  // for the theater map
}
```
**Source:** `GET /api/countries/{id}/dossier`
**Prototype Reference:** `#country-focus`

### 13. TheaterMap (Leaflet)
**Purpose:** Zoomed Leaflet map within country dossier showing local military detail.
**Behavior:** Separate Leaflet instance. Pre-zoomed to country bounds. Shows strike sites, bases, nuclear facilities, oil infrastructure, displacement flows, missile ranges.
**Source:** Uses `theaterAssets` from the country dossier endpoint.
**Prototype Reference:** `#cf-leaflet-map`

### 14. DigestMode
**Purpose:** Narrative intelligence overlay — transforms data wall into analyst-written brief.
**Sections:**
- Headline + Threat Level Summary
- Temporal Triage (Past / Now / Next columns with probability scores)
- Story Arcs (causal chains with "So What?" implication boxes)
- What To Watch Right Now (ranked 1-5 with urgency tags)
- Ask the Analyst (AI chat interface)

**Data Shape:**
```typescript
interface DigestBrief {
  headline: string;
  threatLevel: number;
  threatLabel: string;
  temporal: {
    past: TemporalItem[];
    now: TemporalItem[];
    next: TemporalItem[];    // with probability scores
  };
  storyArcs: StoryArc[];
  watchItems: WatchItem[];
}
```
**Source:** `GET /api/digest/current` (could be AI-generated)
**Prototype Reference:** `#digest-overlay`

### 15. AnalystChat
**Purpose:** Natural language Q&A with AI analyst. Lives inside Digest Mode.
**Behavior:** Text input. Typewriter effect for responses. Context-aware — knows current threat landscape. Keyword matching for common questions, with LLM fallback for complex queries.
**Source:** `POST /api/analyst/ask` → streams response
**Prototype Reference:** `.analyst-chat`

### 16. SearchPalette
**Purpose:** Command palette (⌘K). Search countries, entities, signals. Quick actions.
**Behavior:** Modal overlay. Fuzzy search. Recent searches. Category-filtered results (Countries, Entities, Signals, Actions).
**Prototype Reference:** `#cmd-palette`

### 17. MultiMonitorManager
**Purpose:** Modal for configuring multi-monitor layouts. Syncs state across windows.
**Behavior:** Shows available roles. Each window picks a role. BroadcastChannel syncs events (country selection, time range, focus changes) across windows.
**Prototype Reference:** `#mm-modal`

### 18. NotificationPanel
**Purpose:** Alert/notification drawer.
**Behavior:** Slide-in from right. Grouped by severity. Mark as read. Click to navigate.
**Prototype Reference:** Notification bell in topbar

### 19. AmbientAudio
**Purpose:** Optional ambient sound system for operational awareness.
**Behavior:** Low 55Hz drone (barely perceptible). Alert pings on critical events. Volume/mute toggle. Web Audio API.
**Prototype Reference:** Audio toggle in topbar

---

## Component Count Summary

| Category | Count |
|----------|-------|
| Shell / Layout | 4 |
| Level 1 (Command Surface) | 8 (including map sub-components) |
| Level 2 (Deep Intelligence) | 4 sections × 4 cards = 16 cards |
| Level 3 (Investigation) | 2 |
| Overlays | 8 |
| **Total** | **~38 components** |

---

## Build Priority Order

1. AppShell + TopBar + Sidebar (the container)
2. KPIStrip (simple, validates data flow)
3. GlobalMap with Leaflet (highest visual impact)
4. PanelGrid (IntelFeed, Countries, Markets, News)
5. HeroAlert
6. CountryFocusDossier + TheaterMap
7. DigestMode
8. L2 Deep Intelligence sections
9. L3 Investigation Canvas
10. SearchPalette, Notifications, Audio
11. MultiMonitorManager

---

*Each component's TypeScript interface should live in `src/types/` and be imported by both the component and the API hook.*
