import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'moderate' | 'low';

interface L2CardData {
  title: string;
  items: string[];
  severity: Severity;
  updatedAt: string;
}

interface L2SectionData {
  id: string;
  icon: string;
  name: string;
  color: string;
  cards: L2CardData[];
}

// ── Severity dot colors ────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  critical: '#FF2040',
  high:     '#FF6020',
  moderate: '#F5A020',
  low:      '#00D878',
};

// ── Mock data ──────────────────────────────────────────────────────────────

const L2_SECTIONS: L2SectionData[] = [
  {
    id: 'infrastructure',
    icon: '⬡',
    name: 'Infrastructure & Supply Chain',
    color: '#FF9000',
    cards: [
      {
        title: 'CRITICAL CHOKEPOINTS',
        severity: 'critical',
        updatedAt: '4m ago',
        items: [
          'Hormuz: CRITICAL — 23 ships, 4 turned back',
          'Suez: ELEVATED — 47 ships, 4–6h delay',
          'Bab el-Mandeb: HIGH — Houthi missile range',
        ],
      },
      {
        title: 'ENERGY INFRASTRUCTURE',
        severity: 'high',
        updatedAt: '2m ago',
        items: [
          'Isfahan refinery: ACTIVE FIRE',
          'Bushehr refinery: ACTIVE FIRE',
          'Kharg Island terminal: AT RISK — 90% Iran exports',
        ],
      },
      {
        title: 'SUPPLY CHAIN DISRUPTIONS',
        severity: 'high',
        updatedAt: '11m ago',
        items: [
          'Cape reroute adding +10 days transit',
          'War risk insurance +300%',
          'Container rates spiking on Asia–Europe routes',
        ],
      },
      {
        title: 'SHIPPING & LOGISTICS',
        severity: 'moderate',
        updatedAt: '7m ago',
        items: [
          '312 vessels tracked in theater',
          '4 tankers reversed at Hormuz',
          'LNG carriers rerouting from Qatar',
        ],
      },
    ],
  },
  {
    id: 'financial',
    icon: '◈',
    name: 'Financial Intelligence',
    color: '#00D878',
    cards: [
      {
        title: 'SANCTIONS TRACKER',
        severity: 'high',
        updatedAt: '8m ago',
        items: [
          'New OFAC designations pending on IRGC units',
          'SWIFT cutoff for 3 Iranian banks imminent',
          'Russia–Iran payment channels under scrutiny',
        ],
      },
      {
        title: 'TRADE FLOW IMPACT',
        severity: 'high',
        updatedAt: '15m ago',
        items: [
          'Iran oil exports: effectively zero during conflict',
          'Gulf state LNG: force majeure discussions',
          'Asian refiners scrambling for alternative crude',
        ],
      },
      {
        title: 'CURRENCY STRESS',
        severity: 'moderate',
        updatedAt: '6m ago',
        items: [
          'IRR: 612,400/USD (+8.6% in 24h)',
          'TRY under pressure from regional instability',
          'Safe haven flows into CHF, JPY, Gold',
        ],
      },
      {
        title: 'ENERGY MARKETS',
        severity: 'moderate',
        updatedAt: '3m ago',
        items: [
          'Brent: $67.02 (+4.2%)',
          'WTI: $63.40 (+3.8%)',
          'European gas futures: +12% on supply fears',
        ],
      },
    ],
  },
  {
    id: 'military',
    icon: '⚔',
    name: 'Military & Defense',
    color: '#FF2040',
    cards: [
      {
        title: 'FORCE POSTURE',
        severity: 'critical',
        updatedAt: '1m ago',
        items: [
          '4 CSGs in theater (Nimitz, Lincoln, Reagan, Truman)',
          'THAAD batteries deployed: Qatar, UAE, Israel',
          'B-2 Spirit en route with GBU-57 MOPs',
        ],
      },
      {
        title: 'WEAPONS SYSTEMS',
        severity: 'critical',
        updatedAt: '9m ago',
        items: [
          'Shahab-3 TELs: 3 repositioned near Dezful',
          'Emad MRBMs: launchers at Kermanshah',
          'Houthi SSMs: C-802/Noor in Hodeidah',
        ],
      },
      {
        title: 'ALLIANCE ACTIVITY',
        severity: 'high',
        updatedAt: '13m ago',
        items: [
          'NATO Article 5 consultation requested',
          'UK deploying HMS Queen Elizabeth to Med',
          'France raising VIGIPIRATE to max',
        ],
      },
      {
        title: 'ARMS TRANSFERS',
        severity: 'moderate',
        updatedAt: '22m ago',
        items: [
          'Russia–Iran S-400 delivery: status unknown',
          'China positioning: calling for restraint',
          'North Korea monitoring for opportunistic action',
        ],
      },
    ],
  },
  {
    id: 'cyber',
    icon: '⬢',
    name: 'Cyber Threat Landscape',
    color: '#CC44FF',
    cards: [
      {
        title: 'ACTIVE CAMPAIGNS',
        severity: 'critical',
        updatedAt: '2m ago',
        items: [
          'APT33: wiper malware on Gulf energy targets',
          'APT35: phishing US defense contractors',
          'MuddyWater: espionage against Israeli gov',
        ],
      },
      {
        title: 'THREAT ACTOR PROFILES',
        severity: 'high',
        updatedAt: '18m ago',
        items: [
          'APT33 (Elfin): IRGC-linked, destructive capability',
          'APT35 (Charming Kitten): Intel collection',
          'Shamoon 4.0 variant: detected, not yet deployed',
        ],
      },
      {
        title: 'VULNERABILITY LANDSCAPE',
        severity: 'high',
        updatedAt: '5m ago',
        items: [
          'ICS/SCADA in Gulf: 47 exposed endpoints',
          'Oil & gas sector: 12 critical CVEs unpatched',
          'DNS infrastructure: DDoS staging detected',
        ],
      },
      {
        title: 'ATTRIBUTION CONFIDENCE',
        severity: 'moderate',
        updatedAt: '10m ago',
        items: [
          'APT33 Gulf campaign: HIGH (NSA/CYBERCOM)',
          'Shamoon variant: MODERATE (behavioral match)',
          'DDoS staging: LOW (proxy infrastructure)',
        ],
      },
    ],
  },
];

// ── L2 Card ────────────────────────────────────────────────────────────────

interface L2CardProps {
  card: L2CardData;
  accentColor: string;
}

function L2Card({ card, accentColor }: L2CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#080D18',
        border: `1px solid ${hovered ? '#2E4A6A' : '#1C2C42'}`,
        borderTopWidth: 2,
        borderTopColor: accentColor,
        borderRadius: 5,
        padding: '8px 10px',
        transition: 'border-color 150ms',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
    >
      {/* Title row + severity dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: SEV_COLOR[card.severity],
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#A8BBD0',
            textTransform: 'uppercase',
          }}
        >
          {card.title}
        </span>
      </div>

      {/* Bullet items */}
      <div style={{ flex: 1 }}>
        {card.items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 5,
              fontSize: 11,
              color: '#ECF0F8',
              lineHeight: 1.5,
              paddingBottom: 2,
            }}
          >
            <span style={{ color: '#4E6480', flexShrink: 0, fontSize: 10, paddingTop: 1 }}>›</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div
        style={{
          marginTop: 7,
          fontSize: 9,
          color: '#2A3C52',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        Updated {card.updatedAt}
      </div>
    </div>
  );
}

// ── L2 Section ────────────────────────────────────────────────────────────

interface L2SectionProps {
  section: L2SectionData;
}

function L2Section({ section }: L2SectionProps) {
  return (
    <div style={{ padding: '0 6px 20px' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '10px 4px 8px',
          borderBottom: `1px solid ${section.color}33`,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, color: section.color, flexShrink: 0 }}>
          {section.icon}
        </span>
        <span
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.1em',
            color: section.color,
            textTransform: 'uppercase',
          }}
        >
          {section.name}
        </span>
        <div style={{ flex: 1 }} />
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#2A3C52',
            background: '#0C1422',
            padding: '1px 6px',
            borderRadius: 2,
          }}
        >
          {section.cards.length}
        </span>
      </div>

      {/* 2×2 card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 6,
        }}
      >
        {section.cards.map((card) => (
          <L2Card key={card.title} card={card} accentColor={section.color} />
        ))}
      </div>
    </div>
  );
}

// ── L2 Divider ────────────────────────────────────────────────────────────

function L2Divider() {
  return (
    <div style={{ padding: '16px 6px 14px', textAlign: 'center' }}>
      {/* Centered label over horizontal line */}
      <div style={{ position: 'relative', marginBottom: 7 }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #1C2C42 20%, #1C2C42 80%, transparent)',
            transform: 'translateY(-50%)',
          }}
        />
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            background: '#05080F',
            padding: '0 16px',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.2em',
            color: '#2A3C52',
            textTransform: 'uppercase',
          }}
        >
          LEVEL 2 · DEEP INTELLIGENCE
        </span>
      </div>
      {/* Subtitle */}
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: '#4E6480',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Sector-specific analysis across infrastructure, financial, military, and cyber domains
      </p>
    </div>
  );
}

// ── L2Grid (main export) ──────────────────────────────────────────────────

export default function L2Grid() {
  return (
    <div style={{ flexShrink: 0 }}>
      <L2Divider />
      {L2_SECTIONS.map((section) => (
        <L2Section key={section.id} section={section} />
      ))}
    </div>
  );
}
