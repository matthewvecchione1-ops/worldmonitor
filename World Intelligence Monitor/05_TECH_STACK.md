# W·I·M — Tech Stack
## Framework Decisions and Rationale

---

## Frontend Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React 18+ | Complex component state, large ecosystem, great for real-time UIs. Component model maps 1:1 to our prototype structure. |
| **Language** | TypeScript (strict) | With 12+ API endpoints and 38 components passing data, type safety prevents phantom bugs. Every data contract becomes an interface. |
| **Build Tool** | Vite | Fast HMR (instant feedback during dev), native ESM, excellent React/TS support, simple config. |
| **Styling** | Tailwind CSS | Utility-first matches our token-heavy design system. Custom config maps directly from our design tokens. No CSS file sprawl. |
| **State (UI)** | Zustand | Lightweight, no boilerplate. Perfect for UI state: active role, open panels, selected country, layer toggles. |
| **State (Server)** | TanStack Query (React Query) | Handles caching, refetching, stale-while-revalidate, WebSocket integration. Turns our 12 API endpoints into auto-managed data. |
| **Mapping** | Leaflet 1.9 + React-Leaflet | Already validated in prototype. Free, open-source, extensive plugin ecosystem. Dark tiles from CartoDB. |
| **Charts** | Recharts or D3 | Recharts for standard charts (L2 sections). D3 for the entity graph (L3 investigation canvas). |
| **Icons** | Lucide React | Clean, consistent, tree-shakeable. |
| **Routing** | React Router v6 | If we need URL-based views. May be optional if everything is overlays. |

### Alternative Considered: Mapbox GL JS
Mapbox offers vector tiles, 3D terrain, smoother zoom, and satellite imagery. But it requires an API key and has usage-based pricing. **Recommendation:** Start with Leaflet (free, validated), switch to Mapbox later if we need 3D terrain or building-level zoom at Natanz.

### Alternative Considered: Next.js
Next.js adds SSR, file-based routing, and API routes. But WIM is a single-page app with real-time data — SSR adds complexity without clear benefit. **Recommendation:** Stay with Vite + React for simplicity. Consider Next.js only if we add a marketing site or need SEO.

---

## Backend Stack

[TODO: Document based on existing repo]

### Recommended additions (if building from scratch):

| Layer | Choice | Why |
|-------|--------|-----|
| **Runtime** | Node.js or Python (FastAPI) | Depends on existing backend. Node for WebSocket native support. Python for data science ecosystem. |
| **API** | REST + WebSocket | REST for on-demand data, WebSocket for live updates |
| **Database** | PostgreSQL + Redis | Postgres for persistent data (countries, entities, history). Redis for real-time cache (live signals, market ticks). |
| **Search** | Elasticsearch or Meilisearch | Full-text search across signals, entities, countries |
| **Queue** | Redis Streams or RabbitMQ | Signal ingestion pipeline, event processing |
| **AI** | Anthropic Claude API + xAI Grok API | See 07_AI_INTEGRATION.md |

---

## Project Structure

```
worldmonitor/
├── frontend/                    # React app (NEW)
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx          # Root component
│   │   │   └── main.tsx         # Entry point
│   │   │
│   │   ├── components/
│   │   │   ├── shell/
│   │   │   │   ├── AppShell.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── IntelRail.tsx
│   │   │   │
│   │   │   ├── l1/              # Level 1 - Command Surface
│   │   │   │   ├── HeroAlert.tsx
│   │   │   │   ├── KPIStrip.tsx
│   │   │   │   ├── KPICard.tsx
│   │   │   │   ├── GlobalMap.tsx
│   │   │   │   ├── MapLayerPanel.tsx
│   │   │   │   ├── PanelGrid.tsx
│   │   │   │   ├── IntelFeed.tsx
│   │   │   │   ├── CountryInstability.tsx
│   │   │   │   ├── Markets.tsx
│   │   │   │   └── WorldNews.tsx
│   │   │   │
│   │   │   ├── l2/              # Level 2 - Deep Intelligence
│   │   │   │   ├── L2Section.tsx
│   │   │   │   ├── IntelCard.tsx
│   │   │   │   ├── Infrastructure.tsx
│   │   │   │   ├── FinancialIntel.tsx
│   │   │   │   ├── MilitaryDefense.tsx
│   │   │   │   └── CyberThreat.tsx
│   │   │   │
│   │   │   ├── l3/              # Level 3 - Investigation
│   │   │   │   ├── EntityGraph.tsx
│   │   │   │   └── DetailPanel.tsx
│   │   │   │
│   │   │   ├── overlays/
│   │   │   │   ├── CountryFocus.tsx
│   │   │   │   ├── TheaterMap.tsx
│   │   │   │   ├── DigestMode.tsx
│   │   │   │   ├── AnalystChat.tsx
│   │   │   │   ├── SearchPalette.tsx
│   │   │   │   ├── MultiMonitorManager.tsx
│   │   │   │   └── NotificationPanel.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── Badge.tsx
│   │   │       ├── SeverityDot.tsx
│   │   │       ├── StatRow.tsx
│   │   │       └── Spinner.tsx
│   │   │
│   │   ├── hooks/               # Data fetching hooks
│   │   │   ├── useHeroAlert.ts
│   │   │   ├── useKPIs.ts
│   │   │   ├── useMapAssets.ts
│   │   │   ├── useIntelFeed.ts
│   │   │   ├── useCountries.ts
│   │   │   ├── useMarkets.ts
│   │   │   ├── useCountryDossier.ts
│   │   │   ├── useDigest.ts
│   │   │   ├── useAnalyst.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useWebSocket.ts  # Central WS connection
│   │   │
│   │   ├── stores/              # Zustand stores
│   │   │   ├── useLayoutStore.ts    # Active role, panel visibility
│   │   │   ├── useMapStore.ts       # Layer toggles, zoom, center
│   │   │   ├── useFocusStore.ts     # Selected country, entity
│   │   │   └── useAudioStore.ts     # Ambient sound state
│   │   │
│   │   ├── types/               # TypeScript interfaces
│   │   │   ├── alert.ts
│   │   │   ├── kpi.ts
│   │   │   ├── map.ts
│   │   │   ├── intel.ts
│   │   │   ├── country.ts
│   │   │   ├── market.ts
│   │   │   ├── digest.ts
│   │   │   ├── graph.ts
│   │   │   └── api.ts           # Generic API response wrapper
│   │   │
│   │   ├── lib/                 # Utilities
│   │   │   ├── api.ts           # Base API client (fetch wrapper)
│   │   │   ├── ws.ts            # WebSocket client
│   │   │   ├── mapHelpers.ts    # Leaflet marker factories, popup builders
│   │   │   ├── audio.ts         # Web Audio API ambient system
│   │   │   ├── broadcast.ts     # BroadcastChannel for multi-monitor
│   │   │   ├── formatters.ts    # Number formatting, time ago, etc.
│   │   │   └── constants.ts     # API base URL, WS URL, etc.
│   │   │
│   │   └── styles/
│   │       ├── globals.css      # Tailwind directives + base styles
│   │       └── leaflet-dark.css # Leaflet dark theme overrides
│   │
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                     # [TODO: Existing backend]
│   └── ...
│
├── docs/                        # This documentation folder
│   ├── 01_PROJECT_BIBLE.md
│   ├── 02_COMPONENT_INVENTORY.md
│   ├── 03_DATA_CONTRACTS.md
│   ├── 04_DESIGN_SYSTEM.md
│   ├── 05_TECH_STACK.md
│   ├── 06_IMPLEMENTATION_PLAN.md
│   ├── 07_AI_INTEGRATION.md
│   └── 08_PROTOTYPE_GUIDE.md
│
├── prototype/
│   └── wim-v3.html              # The prototype (design reference)
│
└── README.md
```

---

## Key Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-leaflet": "^4.2.0",
    "leaflet": "^1.9.4",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "recharts": "^2.12.0",
    "d3": "^7.9.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/react": "^18.3.0",
    "@types/leaflet": "^1.9.0",
    "@types/d3": "^7.4.0",
    "eslint": "^9.0.0"
  }
}
```

---

## Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000/ws
VITE_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png
VITE_MAP_LABELS_URL=https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png
VITE_ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

---

## Development Workflow

```bash
# Install
cd frontend && npm install

# Dev server (hot reload)
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

---

*All choices prioritize: developer speed, type safety, real-time capability, and map performance.*
