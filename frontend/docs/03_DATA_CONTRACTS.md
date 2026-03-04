# W·I·M — Data Contracts
## API Endpoints, JSON Shapes, and Refresh Strategies

> **This is the bridge between frontend and backend.** Every endpoint listed here defines a contract: the frontend expects this shape, the backend provides it. If this document is accurate, both teams can work independently.

---

## Connection Types

| Type | Use Case | Implementation |
|------|----------|---------------|
| REST (GET) | Initial load, on-demand data | TanStack Query with cache |
| REST (POST) | AI analyst queries, search | TanStack Query mutations |
| WebSocket | Live signals, market ticks, alerts | Central WS connection → pump into Query cache |

---

## Authentication

[TODO: Define auth strategy — JWT? API key? Session?]

```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Hero Alert

```
GET /api/alerts/hero
```

Returns the single most critical active alert.

```json
{
  "id": "alert-2026-03-01-iran",
  "severity": "critical",
  "headline": "Iran Crisis — Day 2: IRGC at maximum readiness. Retaliation expected within 6–18h. Hormuz disruption imminent. Oil +2.8%, VIX +38%.",
  "probability": 0.94,
  "probabilityLabel": "retaliatory strike",
  "countryId": "iran",
  "timestamp": "2026-03-01T22:00:00Z",
  "dismissed": false
}
```

**Also pushed via WebSocket** when alert changes or new critical event occurs.

---

### 2. KPI Summary

```
GET /api/kpi/summary
```

```json
{
  "kpis": [
    {
      "id": "global-risk",
      "label": "Global Risk Score",
      "value": 78,
      "change": 12,
      "changePeriod": "24h",
      "context": "Highest since Feb 2022 Ukraine invasion. Driven by Iran decapitation strike and cascading retaliation risk.",
      "isPrimary": true
    },
    {
      "id": "active-threats",
      "label": "Active Threats",
      "value": 247,
      "change": 12,
      "changePeriod": "1h"
    },
    {
      "id": "crisis-countries",
      "label": "Crisis Countries",
      "value": 14,
      "change": 3,
      "changePeriod": "24h"
    },
    {
      "id": "live-signals",
      "label": "Live Signals",
      "value": 1847,
      "change": 0,
      "changePeriod": "stable"
    },
    {
      "id": "cyber-incidents",
      "label": "Cyber Incidents",
      "value": 38,
      "change": 7,
      "changePeriod": "6h"
    },
    {
      "id": "vessels-tracked",
      "label": "Vessels Tracked",
      "value": 312,
      "change": null,
      "changePeriod": "Live AIS"
    }
  ]
}
```

**Refresh:** Poll every 60s or WebSocket push on change.

---

### 3. Map Assets

```
GET /api/map/assets?types=carrier,base,submarine,aircraft,hostile,nuclear,proxy,chokepoint
```

```json
{
  "assets": [
    {
      "id": "csg3-nimitz",
      "lat": 24.5,
      "lng": 58.2,
      "type": "carrier",
      "name": "CSG-3 · USS Nimitz (CVN-68)",
      "detail": "Carrier Air Wing 17 · 5 escorts\nCG-52 Bunker Hill · DDG-73 Decatur\nDDG-110 William P. Lawrence",
      "status": "COMBAT READY",
      "statusColor": "#00AAFF",
      "heading": 310,
      "lastUpdated": "2026-03-01T22:15:00Z"
    },
    {
      "id": "natanz-fep",
      "lat": 33.72,
      "lng": 51.72,
      "type": "nuclear",
      "name": "Natanz (FEP)",
      "detail": "Fuel Enrichment Plant\nIR-6 centrifuges · Up to 60% HEU\nStrike damage assessment: PENDING",
      "status": "NUCLEAR",
      "statusColor": "#FFD000"
    }
  ]
}
```

**Refresh:** Every 30s for positions, 5min for static assets.

---

### 4. Map Routes

```
GET /api/map/routes
```

```json
{
  "routes": [
    {
      "id": "tanker-gulf-indian",
      "points": [[26.5, 56.5], [25.5, 57.0], [24.5, 58.0], [22.0, 60.0], [18.0, 62.0]],
      "color": "#00D878",
      "label": "Tanker: Gulf → Indian Ocean",
      "type": "tanker",
      "vesselCount": 8,
      "status": "active"
    },
    {
      "id": "reroute-cape",
      "points": [[26.5, 56.5], [24.0, 57.5], [20.0, 62.0], [-35.0, 20.0]],
      "color": "#FF9000",
      "label": "Rerouted: Cape of Good Hope",
      "type": "reroute",
      "vesselCount": 4,
      "status": "active"
    }
  ]
}
```

---

### 5. Map Zones (Airspace, Missile Ranges)

```
GET /api/map/zones
```

```json
{
  "airspace": [
    {
      "id": "iran-closed",
      "polygon": [[39.8, 44.0], [39.8, 63.3], [25.0, 63.3], [25.0, 44.0]],
      "label": "IRAN AIRSPACE — CLOSED",
      "status": "closed",
      "detail": "All civil aviation suspended. 47 flights rerouted."
    }
  ],
  "missileRanges": [
    {
      "id": "shahab-3",
      "centerLat": 32.5,
      "centerLng": 53.0,
      "radiusMeters": 1300000,
      "label": "Shahab-3 · 1,300 km",
      "source": "IRGC Aerospace Force"
    }
  ]
}
```

---

### 6. Intel Feed

```
GET /api/intel/feed?limit=50&offset=0&severity=all
```

```json
{
  "items": [
    {
      "id": "intel-20260301-001",
      "source": "The War Zone",
      "headline": "U.S.–Israeli War With Iran Enters Day Two — strikes across 3 provinces",
      "severity": "alert",
      "tags": ["MILITARY", "CONFLICT"],
      "timestamp": "2026-03-01T20:00:00Z",
      "url": "https://example.com/article",
      "relatedCountry": "iran",
      "isUrgent": true
    }
  ],
  "total": 247,
  "hasMore": true
}
```

**Also pushed via WebSocket** for new items:
```json
{"event": "intel:new", "data": { /* same IntelItem shape */ }}
```

---

### 7. Country Instability Scores

```
GET /api/countries/instability?limit=20&sort=score_desc
```

```json
{
  "countries": [
    {
      "id": "iran",
      "name": "Iran",
      "score": 92,
      "change": 18,
      "trend": "up",
      "primaryDriver": "US-Israeli strikes, leadership decapitation"
    },
    {
      "id": "ukraine",
      "name": "Ukraine",
      "score": 78,
      "change": -2,
      "trend": "stable",
      "primaryDriver": "Ongoing conflict, front line stable"
    }
  ]
}
```

---

### 8. Market Summary

```
GET /api/markets/summary
```

```json
{
  "tickers": [
    {"ticker": "AAPL", "price": 264.18, "change": -3.21, "category": "equity"},
    {"ticker": "OIL", "price": 67.02, "change": 2.78, "category": "commodity"},
    {"ticker": "GOLD", "price": 5248, "change": 1.03, "category": "commodity"},
    {"ticker": "VIX", "price": 19.86, "change": 6.60, "category": "index"},
    {"ticker": "BTC", "price": 66963, "change": 5.41, "category": "crypto"}
  ],
  "sectors": [
    {"name": "Tech", "change": -1.6},
    {"name": "Energy", "change": 1.6},
    {"name": "Defense", "change": 4.2}
  ]
}
```

**WebSocket for live ticks:**
```json
{"event": "market:tick", "data": {"ticker": "OIL", "price": 67.15, "change": 2.98}}
```

---

### 9. Country Dossier

```
GET /api/countries/{id}/dossier
```

This is the largest endpoint. Returns everything needed for the Country Focus overlay.

```json
{
  "id": "iran",
  "name": "Iran",
  "officialName": "Islamic Republic of Iran",
  "region": "Middle East",
  "population": "88.5M",
  "flagEmoji": "🇮🇷",
  "riskScore": 92,
  "riskChange": 18,
  "riskLevel": "critical",

  "situation": "US-Israeli forces conducted coordinated multi-site strikes across Iran overnight targeting military, nuclear, and command infrastructure. Supreme Leader Khamenei confirmed dead...",

  "stats": [
    {"label": "Risk Score", "value": "92 / 100", "change": "+18"},
    {"label": "Active Signals", "value": "247", "change": "+84"},
    {"label": "Airspace", "value": "CLOSED", "change": null},
    {"label": "Internet", "value": "42% of normal", "change": "↓"},
    {"label": "Currency (IRR)", "value": "612,400/USD", "change": "+8.6%"}
  ],

  "entities": [
    {"id": "irgc", "name": "IRGC", "type": "Military Arm", "icon": "⚔", "risk": 94},
    {"id": "hezbollah", "name": "Hezbollah", "type": "Proxy · Lebanon", "icon": "🎯", "risk": 74}
  ],

  "timeline": [
    {"time": "2h ago", "text": "US-Israeli strikes hit 30+ targets across Isfahan, Bushehr, Tehran Province", "severity": "critical", "sources": "The War Zone · BBC · AP"},
    {"time": "4h ago", "text": "Supreme Leader Khamenei confirmed dead", "severity": "critical", "sources": "IRNA · Press TV"}
  ],

  "predictions": [
    {"event": "Iranian retaliatory strike on US/Israeli assets", "probability": 0.94, "timeline": "Within 18 hours", "confidence": "Near-certain"},
    {"event": "Strait of Hormuz partial closure", "probability": 0.72, "timeline": "Within 72 hours", "confidence": "Likely"}
  ],

  "theaterAssets": [
    {"lat": 35.69, "lng": 51.39, "type": "hostile", "name": "IRGC HQ · Tehran", "detail": "STRUCK in wave 1", "status": "STRUCK"},
    {"lat": 33.72, "lng": 51.72, "type": "nuclear", "name": "Natanz (FEP)", "detail": "Strike damage: PENDING", "status": "NUCLEAR"}
  ]
}
```

---

### 10. AI Analyst

```
POST /api/analyst/ask
Content-Type: application/json
```

**Request:**
```json
{
  "question": "How does Hormuz connect to the energy crisis?",
  "context": {
    "activeCountry": "iran",
    "currentThreatLevel": 92,
    "recentSignals": ["iran-strike", "hormuz-blockade", "oil-spike"]
  }
}
```

**Response (streamed):**
```json
{
  "answer": "The Strait of Hormuz handles roughly 20% of global oil supply...",
  "sources": ["AIS tracking data", "EIA reports", "IRGC naval doctrine"],
  "confidence": 0.87,
  "model": "claude-sonnet-4-5-20250929"
}
```

**Streaming:** Response should be streamed (SSE or WebSocket) for typewriter effect.

---

### 11. Digest Brief

```
GET /api/digest/current
```

```json
{
  "headline": "IRAN CRISIS — DAY 2",
  "threatLevel": 92,
  "threatLabel": "CRITICAL",
  "summary": "The most significant military escalation in the Middle East since 2003...",

  "temporal": {
    "past": [
      {"text": "US-Israeli coordinated strikes on 30+ targets", "time": "0-6h ago"}
    ],
    "now": [
      {"text": "IRGC at maximum readiness, retaliatory posture confirmed", "isActive": true}
    ],
    "next": [
      {"text": "Iranian retaliatory strike expected", "probability": 0.94, "timeframe": "6-18h"}
    ]
  },

  "storyArcs": [
    {
      "chain": ["Strike", "Khamenei Dead", "IRGC Retaliation", "Proxy Activation", "Regional War Risk"],
      "soWhat": "This is the highest probability escalation path. Each step increases..."
    }
  ],

  "watchItems": [
    {"rank": 1, "text": "IRGC missile launch indicators", "urgency": "IMMINENT"},
    {"rank": 2, "text": "Hormuz mine-laying activity", "urgency": "HIGH"}
  ]
}
```

---

### 12. Search

```
GET /api/search?q={query}&type=all
```

```json
{
  "results": [
    {"type": "country", "id": "iran", "name": "Iran", "score": 92},
    {"type": "entity", "id": "irgc", "name": "IRGC", "subtype": "Military Organization"},
    {"type": "signal", "id": "sig-001", "headline": "IRGC declares maximum readiness"}
  ]
}
```

---

## WebSocket Events

Connect to: `wss://[host]/ws`

| Event | Direction | Payload |
|-------|-----------|---------|
| `alert:hero` | Server → Client | HeroAlert object |
| `intel:new` | Server → Client | IntelItem object |
| `market:tick` | Server → Client | {ticker, price, change} |
| `country:score` | Server → Client | {id, score, change} |
| `signal:new` | Server → Client | TrendingSignal object |
| `kpi:update` | Server → Client | Partial KPI update |

---

## Error Responses

All endpoints return errors in this shape:

```json
{
  "error": true,
  "code": "NOT_FOUND",
  "message": "Country 'xyz' not found in monitored countries"
}
```

HTTP status codes: 200 (success), 400 (bad request), 401 (unauthorized), 404 (not found), 429 (rate limited), 500 (server error).

---

## Rate Limits

[TODO: Define rate limits based on backend capacity]

Suggested defaults:
- REST endpoints: 100 req/min per client
- WebSocket: 1 connection per client, unlimited messages
- AI analyst: 10 req/min per client (LLM cost control)

---

*When the backend is ready, update each [TODO] section with actual endpoint URLs, auth headers, and any differences from these specs.*
