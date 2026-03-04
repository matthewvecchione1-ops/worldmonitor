# W·I·M — World Intelligence Monitor
## Project Bible v1.0

> **This is the master reference document for the WIM project.** Any developer, AI agent, or team member should read this first. It explains what we're building, why, and how everything connects.

---

## 1. What Is WIM?

WIM (World Intelligence Monitor) is a **real-time global intelligence dashboard** designed for geopolitical analysts, security professionals, defense teams, and informed decision-makers. Think Bloomberg Terminal meets Palantir meets CrowdStrike — but for geopolitical risk.

It monitors global events across military, political, economic, cyber, and environmental domains, scores country-level instability in real time, and presents actionable intelligence through a progressive disclosure interface.

**The core promise:** Answer "what do I need to know right now?" in under 3 seconds, then let the analyst drill as deep as they want.

---

## 2. Product Vision

### What Makes WIM Different

| Feature | Bloomberg | Palantir | CrowdStrike | WIM |
|---------|-----------|----------|-------------|-----|
| Real-time geopolitical signals | ❌ | Partial | ❌ | ✅ |
| Military asset tracking | ❌ | ✅ (classified) | ❌ | ✅ (OSINT) |
| Market impact correlation | ✅ | ❌ | ❌ | ✅ |
| AI analyst chat | ❌ | ❌ | AI-assisted | ✅ |
| Multi-monitor operations | Limited | ✅ | ❌ | ✅ |
| Country dossier system | ❌ | ✅ | ❌ | ✅ |
| Open-source pricing | ❌ ($25K/yr) | ❌ ($M+) | ❌ ($50K+) | ✅ |

### Target Users

1. **Intelligence analysts** — government, think tanks, consultancies
2. **Risk managers** — corporations with global supply chain exposure
3. **Defense/military** — situational awareness, operational planning
4. **Journalists** — conflict reporting, verification, context
5. **Financial professionals** — geopolitical risk impact on markets
6. **Informed citizens** — power users who want signal, not noise

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (NEW)                         │
│         React + TypeScript + Vite + Tailwind                │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Global   │ │ Intel    │ │ Country  │ │ Digest   │      │
│  │ Map      │ │ Feeds    │ │ Dossiers │ │ Mode     │ ...  │
│  │ (Leaflet)│ │          │ │          │ │          │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │             │            │             │            │
│  ┌────┴─────────────┴────────────┴─────────────┴──────┐    │
│  │              State Management (Zustand)             │    │
│  │         + Server State (TanStack Query)             │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │                                     │
│              WebSocket ↕ REST API                           │
└───────────────────────┼─────────────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────────────┐
│                  BACKEND (EXISTING + NEW)                    │
│                                                             │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │ Signal     │  │ Country     │  │ AI Analyst        │    │
│  │ Ingestion  │  │ Scoring     │  │ (Claude / Grok)   │    │
│  │ Engine     │  │ Engine      │  │                    │    │
│  └─────┬──────┘  └──────┬──────┘  └────────┬─────────┘    │
│        │                │                   │               │
│  ┌─────┴─────────────────┴──────────────────┴──────────┐   │
│  │                    Database                          │   │
│  │         [TODO: Postgres? Mongo? Redis?]              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  External APIs:                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │GDELT │ │ACLED │ │News  │ │Market│ │AIS   │ │Social│  │
│  │      │ │      │ │APIs  │ │Data  │ │Ships │ │Media │  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │
└─────────────────────────────────────────────────────────────┘
```

### What Exists Today

**Backend:** [TODO — Document the existing GitHub repo here]
- Repository URL: [TODO]
- Language/Framework: [TODO]
- Current API endpoints: [TODO — see DATA_CONTRACTS.md]
- Database: [TODO]
- Deployment: [TODO]

**Frontend Prototype:** `wim-v3.html` — a single 2,400-line HTML file containing the complete UI vision. This is our design spec, interaction model, and component reference. It contains:
- Full 3-level progressive disclosure layout (L1 command surface, L2 analysis, L3 investigation)
- Leaflet-based global map with military assets, shipping routes, missile ranges, chokepoints
- Country focus dossier system with theater map
- Digest Mode (narrative intelligence overlay with AI analyst chat)
- Multi-monitor system with 6 role-based layouts
- Ambient audio system
- All using hardcoded/simulated data

### What We're Building

**Phase 1:** Convert the prototype into a production React application
**Phase 2:** Connect it to the existing backend APIs
**Phase 3:** Add real-time data via WebSocket
**Phase 4:** Integrate AI analyst (Claude/Grok)
**Phase 5:** Polish, optimize, deploy

---

## 4. Information Architecture

### Three-Level Progressive Disclosure

This is the core UX principle. Everything in WIM follows this hierarchy:

**Level 1 — Command Surface** (what you see on load)
- Hero alert banner (single most critical event in plain English)
- KPI strip (Global Risk Score, Active Threats, Crisis Countries, Live Signals, Cyber Incidents, Vessels Tracked)
- Global map with military/intelligence layers
- Four live panels: Intel Feed, Country Instability, Markets, World News

**Level 2 — Deep Intelligence** (scroll down)
- Infrastructure & Supply Chain analysis
- Financial Intelligence (sanctions, trade flows, energy)
- Military & Defense posture
- Cyber Threat landscape

**Level 3 — Investigation Canvas** (deepest layer)
- Entity relationship graph
- Timeline reconstruction
- Link analysis workspace

**Overlays** (accessible from any level)
- Country Focus Dossier — full country deep-dive with theater map
- Digest Mode — narrative intelligence brief
- Search/Command Palette (⌘K)
- Notifications panel

### Multi-Monitor System

WIM supports dedicated role-based layouts across multiple screens:

| Role | What It Shows | Use Case |
|------|--------------|----------|
| COMMAND | Map full-screen + layer controls | Situational awareness |
| INTEL | Feeds + country list + detail panel | Signal monitoring |
| MARKETS | Tickers + charts + commodities + FX | Financial impact |
| OPS | Operations timeline + tasking + comms | Team coordination |
| ANALYST | Investigation canvas + entity graph | Deep analysis |
| ALL | Everything on one screen | Single ultrawide display |

Monitors sync via BroadcastChannel API — clicking a country on one screen updates all others.

---

## 5. Key Design Principles

These come from our competitive research across 40+ platforms (Bloomberg, Palantir, CrowdStrike, Dataminr, Recorded Future, ACLED, etc.):

1. **3-Second Rule** — Critical information must be graspable at a glance (Splunk SOC guidance)
2. **Speed is the moat** — Near-zero latency between query and result (Bloomberg's real competitive advantage)
3. **Connected data** — Click any entity to see everything related to it (Janes' 200M validated connections model)
4. **Noise subtraction** — Filter known-benign patterns before they reach the analyst (GreyNoise reduces alert volume 25%)
5. **Signal correlation** — Combine low-confidence signals into high-confidence incidents (Microsoft Sentinel's Fusion engine)
6. **Every score is explainable** — Never show a number without showing why (Recorded Future's evidence-backed risk scores)
7. **Dark mode is functional** — Reduces eye strain in 24/7 operations environments; makes severity colors pop

---

## 6. File Index

| Document | Purpose |
|----------|---------|
| `01_PROJECT_BIBLE.md` | This file. Master overview. |
| `02_COMPONENT_INVENTORY.md` | Every UI component with specs and data needs |
| `03_DATA_CONTRACTS.md` | API endpoint definitions and JSON shapes |
| `04_DESIGN_SYSTEM.md` | Colors, typography, spacing, animation tokens |
| `05_TECH_STACK.md` | Framework decisions and rationale |
| `06_IMPLEMENTATION_PLAN.md` | Phased build order with task breakdown |
| `07_AI_INTEGRATION.md` | Claude/Grok analyst architecture |
| `08_PROTOTYPE_GUIDE.md` | How wim-v3.html maps to React components |

---

## 7. Success Criteria

The product is ready for beta when:

- [ ] All L1 components render with real backend data
- [ ] Map displays real-time military/naval asset positions from OSINT feeds
- [ ] Country instability scores update automatically as new signals arrive
- [ ] Intel feed shows real headlines from integrated news sources
- [ ] Market data updates in real-time via WebSocket
- [ ] Country focus dossier opens with live data for any monitored country
- [ ] AI analyst responds to natural language questions with context-aware analysis
- [ ] Multi-monitor sync works across 2+ browser windows
- [ ] Page loads in under 2 seconds on standard broadband
- [ ] Works on Chrome, Firefox, Safari (latest versions)

---

*Last updated: March 2026*
*Prototype reference: wim-v3.html (2,421 lines)*
