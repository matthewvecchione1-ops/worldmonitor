# W·I·M — Design System
## Colors, Typography, Spacing, Animation, and Visual Language

> **This document defines every visual token used in WIM.** Port these directly into Tailwind config and/or CSS custom properties. The prototype (wim-v3.html) is the visual source of truth.

---

## Color System

### Background Hierarchy (darkest to lightest)

| Token | Hex | Usage |
|-------|-----|-------|
| `--void` | `#05080F` | Page background, deepest layer |
| `--deep` | `#080D18` | Panel backgrounds, modals |
| `--surface` | `#0C1422` | Card backgrounds, containers |
| `--raised` | `#111D30` | Elevated cards, hover states |
| `--elevated` | `#172338` | Active states, selected items |

### Border Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#1C2C42` | Standard borders |
| `--border-hi` | `#243650` | Emphasized borders |
| `--border-glo` | `#2E4A6A` | Glowing/active borders |

### Text Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| `--txt-1` | `#ECF0F8` | Primary text (headlines, values) |
| `--txt-2` | `#8CA0BC` | Secondary text (labels, descriptions) |
| `--txt-3` | `#4E6480` | Tertiary text (timestamps, metadata) |
| `--txt-4` | `#2A3C52` | Quaternary (disabled, decorative) |

### Severity Palette (CRITICAL)

| Level | Token | Hex | Background Variant | Usage |
|-------|-------|-----|-------------------|-------|
| Critical | `--crit` | `#FF2040` | `rgba(255,32,64,0.18)` | Highest threat, active strikes |
| High | `--high` | `#FF6020` | `rgba(255,96,32,0.15)` | Elevated threat, proxy activity |
| Moderate | `--mod` | `#F5A020` | `rgba(245,160,32,0.12)` | Monitoring, potential escalation |
| Low | `--low` | `#4E6480` | — | Normal operations |
| Info | `--info` | `#1A8FFF` | `rgba(26,143,255,0.12)` | Informational, US/allied |

### Functional Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--live` | `#00F080` | Live indicator dots |
| `--pos` | `#00D878` | Positive change, stable |
| `--neg` | `#FF2040` | Negative change (same as crit) |
| `--acc` | `#00CCFF` | Accent, interactive elements, links |

### Domain Colors

| Domain | Token | Hex | Usage |
|--------|-------|-----|-------|
| Military | `--mil` | `#FF2040` | Military events and assets |
| Political | `--pol` | `#1A8FFF` | Political events |
| Economic | `--eco` | `#00D878` | Economic/financial data |
| Cyber | `--cyb` | `#CC44FF` | Cyber threats and incidents |
| Environmental | `--env` | `#FF9000` | Environmental, fires, disasters |
| Nuclear | `--nuc` | `#FFD000` | Nuclear facilities and events |
| Maritime | `--sea` | `#00AAFF` | Naval, shipping, maritime |
| Aviation | `--air` | `#55CCFF` | Aircraft, airspace, flight |

### Map Asset Colors

| Asset Type | Color | Usage |
|-----------|-------|-------|
| US Navy / Carrier | `#00AAFF` | Carrier strike groups |
| US/Allied Base | `#55CCFF` | Military installations |
| Submarine | `#1A8FFF` | Patrol areas |
| Aircraft / ISR | `#CC44FF` | Airborne assets |
| Enemy / Hostile | `#FF2040` | Adversary forces |
| Nuclear Site | `#FFD000` | Nuclear facilities |
| Proxy Force | `#FF6020` | Iran-aligned proxies |
| Shipping Route | `#00D878` | Normal tanker routes |
| Rerouted Shipping | `#FF9000` | Disrupted routes |

---

## Typography

### Font Stack

| Token | Family | Usage |
|-------|--------|-------|
| `--f-dis` | `'Rajdhani', sans-serif` | Display: headlines, labels, KPI values, section titles |
| `--f-bod` | `'DM Sans', sans-serif` | Body: paragraphs, descriptions, feed items |
| `--f-mon` | `'JetBrains Mono', monospace` | Monospace: data values, timestamps, stats, code |

### Type Scale

| Element | Font | Weight | Size | Letter-Spacing | Transform |
|---------|------|--------|------|----------------|-----------|
| KPI Primary Value | Rajdhani | 700 | 32px | 0.02em | — |
| KPI Secondary Value | Rajdhani | 700 | 24px | 0.02em | — |
| Section Title | Rajdhani | 700 | 11px | 0.14em | uppercase |
| Panel Title | Rajdhani | 700 | 11px | 0.12em | uppercase |
| Card Title | Rajdhani | 700 | 11px | 0.12em | uppercase |
| Hero Alert Text | DM Sans | 500 | 13px | — | — |
| Feed Headline | DM Sans | 500 | 12px | — | — |
| Feed Source | Rajdhani | 600 | 9px | 0.08em | uppercase |
| Stat Value | JetBrains Mono | 500 | 11px | — | — |
| Stat Label | DM Sans | 400 | 10px | — | — |
| Timestamp | JetBrains Mono | 400 | 9px | — | — |
| Badge Text | Rajdhani | 700 | 8px | 0.08em | uppercase |
| Map Popup Title | Rajdhani | 700 | 12px | — | — |
| Map Popup Detail | JetBrains Mono | 400 | 9px | — | — |
| Clock | JetBrains Mono | 500 | 11px | 0.08em | — |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--gap` | `6px` | Standard gap between panels/cards |
| `--pad` | `14px` | Standard internal padding |
| `--rad` | `5px` | Standard border radius |
| `--bar-h` | `48px` | Top bar height |
| `--sb-w` | `52px` | Sidebar width |
| `--rail-w` | `296px` | Intel rail width |

### Component-Specific Spacing

| Component | Padding | Gap |
|-----------|---------|-----|
| Panel | 14px | — |
| Panel Header | 10px 14px | — |
| Feed Item | 10px 14px | — |
| KPI Card | 16px 20px | — |
| Card | 14px | — |
| Map Popup | 10px 14px | — |
| Modal | 24px | 16px |

---

## Animation

### Timing Functions

| Name | Value | Usage |
|------|-------|-------|
| Ease out smooth | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Element entrance (overshoot) |
| Ease standard | `ease` | General transitions |
| Ease out | `ease-out` | Fade outs, dismissals |

### Keyframe Animations

| Name | Duration | Usage |
|------|----------|-------|
| `barDrop` | 600ms | TopBar entrance on page load |
| `feedIn` | 400ms | New feed items sliding in |
| `blink` | 1.4s infinite | Live indicator dots |
| `leafPulse` | 2s infinite | Map marker pulse rings |
| `scrollHint` | 1.5s infinite | Scroll indicator bounce |

### Transition Standards

| Element | Property | Duration |
|---------|----------|----------|
| Hover states | background, border-color | 200ms |
| Panel open/close | max-height, opacity | 300ms |
| Modal open | opacity, transform | 250ms |
| Feed item | opacity, transform | 400ms |
| Map popup | opacity | 200ms (Leaflet default) |

---

## Component Visual Patterns

### Panel Pattern
```
┌─────────────────────────────┐
│ ● TITLE              LIVE 247│  ← Header: border-bottom, --surface bg
├─────────────────────────────┤
│                              │
│  Feed items / content        │  ← Body: --deep bg, scrollable
│                              │
└─────────────────────────────┘
   Border: 1px solid --border
   Border-radius: --rad (5px)
   Accent: 2px top-left colored border (per card-accent)
```

### Badge Pattern
```
[ALERT]  → background: --crit-d, color: --crit, font: Rajdhani 700 8px uppercase
[MILITARY] → background: --mil + 15% opacity, color: --mil
[CYBER] → background: --cyb-d, color: --cyb
```

### Severity Indicator Pattern
```
● Critical  → #FF2040 solid dot
● High      → #FF6020 solid dot  
● Moderate  → #F5A020 solid dot
● Low       → #4E6480 solid dot
```

### KPI Card Pattern
```
┌──────────────────────┐
│ GLOBAL RISK SCORE    │  ← Label: Rajdhani 700 9px uppercase, --txt-3
│                      │
│ 78                   │  ← Value: Rajdhani 700 32px, --txt-1 (primary) or 24px (secondary)
│ ↑ +12 (24h)         │  ← Change: JetBrains Mono 10px, --pos or --neg
│                      │
│ Highest since Feb... │  ← Context: DM Sans 9px, --txt-3 (primary only)
└──────────────────────┘
   Background: --deep
   Border: 1px solid --border
   Primary card: grid column 1.6fr (wider than others)
```

---

## Dark Theme Principles

1. **Never use pure black (#000)** — always use --void (#05080F) minimum
2. **Never use pure white (#FFF)** — always use --txt-1 (#ECF0F8) maximum
3. **Severity colors are the only saturated colors** — everything else is desaturated blue-gray
4. **Glows use radial gradients** — not box-shadow (too harsh)
5. **Borders are subtle** — 1px, desaturated, never above #2E4A6A
6. **Active/hover states** shift background one step up the hierarchy (deep → surface → raised → elevated)

---

## Tailwind Config Mapping

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        void: '#05080F',
        deep: '#080D18',
        surface: '#0C1422',
        raised: '#111D30',
        elevated: '#172338',
        border: { DEFAULT: '#1C2C42', hi: '#243650', glo: '#2E4A6A' },
        txt: { 1: '#ECF0F8', 2: '#8CA0BC', 3: '#4E6480', 4: '#2A3C52' },
        crit: '#FF2040',
        high: '#FF6020',
        mod: '#F5A020',
        low: '#4E6480',
        info: '#1A8FFF',
        live: '#00F080',
        pos: '#00D878',
        neg: '#FF2040',
        acc: '#00CCFF',
        mil: '#FF2040',
        pol: '#1A8FFF',
        eco: '#00D878',
        cyb: '#CC44FF',
        env: '#FF9000',
        nuc: '#FFD000',
        sea: '#00AAFF',
        air: '#55CCFF',
      },
      fontFamily: {
        dis: ['Rajdhani', 'sans-serif'],
        bod: ['DM Sans', 'sans-serif'],
        mon: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        gap: '6px',
        pad: '14px',
      },
      borderRadius: {
        wim: '5px',
      },
    },
  },
}
```

---

*This design system was extracted from the wim-v3.html prototype. All values are production-tested in the prototype and should port directly.*
