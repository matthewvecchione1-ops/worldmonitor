import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { API_BASE_URL } from '../../lib/constants';

// ── API response types ──────────────────────────────────────────────────────

interface Chokepoint {
  id?: string;
  name: string;
  status?: string;
  disruptionScore?: number;
  congestionLevel?: number;
  activeWarnings?: number;
  description?: string;
  affectedRoutes?: string[];
}
interface ChokepointResponse { chokepoints?: Chokepoint[] }

interface Theater {
  theater?: string;
  name?: string;
  region?: string;
  postureLevel?: string;
  status?: string;
  activeFlights?: number;
  trackedVessels?: number;
  activeOperations?: string[];
}
interface TheaterResponse { theaters?: Theater[]; postures?: Theater[] }

interface CyberThreat {
  id?: string;
  type?: string;
  actor?: string;
  target?: string;
  targetSector?: string;
  severity?: string;
  description?: string;
  attribution?: string;
  country?: string;
}
interface CyberResponse { threats?: CyberThreat[]; total?: number; pagination?: { totalCount: number } }

// ── Local card types ────────────────────────────────────────────────────────

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

// ── Cyber threat type label map ─────────────────────────────────────────────

const CYBER_TYPE_LABELS: Record<string, string> = {
  CYBER_THREAT_TYPE_C2_SERVER:      'C2 Infrastructure',
  CYBER_THREAT_TYPE_PHISHING:       'Phishing',
  CYBER_THREAT_TYPE_MALWARE:        'Malware',
  CYBER_THREAT_TYPE_RANSOMWARE:     'Ransomware',
  CYBER_THREAT_TYPE_DDOS:           'DDoS Attack',
  CYBER_THREAT_TYPE_SQL_INJECTION:  'SQL Injection',
  CYBER_THREAT_TYPE_ZERO_DAY:       'Zero-Day Exploit',
  CYBER_THREAT_TYPE_APT:            'APT Campaign',
  CYBER_THREAT_TYPE_SUPPLY_CHAIN:   'Supply Chain Attack',
  CYBER_THREAT_TYPE_INSIDER_THREAT: 'Insider Threat',
  CYBER_THREAT_TYPE_DATA_BREACH:    'Data Breach',
  CYBER_THREAT_TYPE_WIPER:          'Wiper Malware',
  CYBER_THREAT_TYPE_BOTNET:         'Botnet',
  CYBER_THREAT_TYPE_UNKNOWN:        'Unknown Threat',
};

/** Convert raw proto enum to human-readable label. Falls back to title-casing. */
function formatCyberType(raw: string | undefined): string {
  if (!raw) return '';
  if (CYBER_TYPE_LABELS[raw]) return CYBER_TYPE_LABELS[raw]!;
  return raw
    .replace(/^CYBER_THREAT_TYPE_/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Severity helpers ────────────────────────────────────────────────────────

const SEV_COLOR: Record<Severity, string> = {
  critical: '#FF2040',
  high:     '#FF6020',
  moderate: '#F5A020',
  low:      '#00D878',
};

function disruptionSeverity(score: number): Severity {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'moderate';
  return 'low';
}


// ── L2 Card component ───────────────────────────────────────────────────────

function L2Card({ card, accentColor }: { card: L2CardData; accentColor: string }) {
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

// ── L2 Section component ────────────────────────────────────────────────────

function L2Section({ section }: { section: L2SectionData }) {
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

      {/* 2-col card grid */}
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

// ── L2 Divider ──────────────────────────────────────────────────────────────

function L2Divider() {
  return (
    <div style={{ padding: '16px 6px 14px', textAlign: 'center' }}>
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
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: '#4E6480',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Sector-specific analysis across infrastructure, military, and cyber domains
      </p>
    </div>
  );
}

// ── L2Grid (main export) ────────────────────────────────────────────────────

export default function L2Grid() {
  const updatedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const { data: chopData } = useQuery<ChokepointResponse>({
    queryKey: ['chokepoints-l2'],
    queryFn: () => fetch(`${API_BASE_URL}/supply-chain/v1/get-chokepoint-status`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: theaterData } = useQuery<TheaterResponse>({
    queryKey: ['theater-posture-l2'],
    queryFn: () => fetch(`${API_BASE_URL}/military/v1/get-theater-posture`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const { data: cyberData } = useQuery<CyberResponse>({
    queryKey: ['cyber-threats-l2'],
    queryFn: () => fetch(`${API_BASE_URL}/cyber/v1/list-cyber-threats?limit=8`).then(r => r.json()),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const sections: L2SectionData[] = [];

  // ── Infrastructure section (from chokepoints) ──
  const chokepoints = chopData?.chokepoints ?? [];
  if (chokepoints.length > 0) {
    const sorted = [...chokepoints].sort((a, b) => (b.disruptionScore ?? 0) - (a.disruptionScore ?? 0));
    const topChoke  = sorted.slice(0, 3);
    const restChoke = sorted.slice(3, 6);

    const cards: L2CardData[] = [];

    if (topChoke.length > 0) {
      const maxScore = Math.max(...topChoke.map(c => c.disruptionScore ?? 0));
      cards.push({
        title: 'CRITICAL CHOKEPOINTS',
        severity: disruptionSeverity(maxScore),
        updatedAt,
        items: topChoke.map(c => {
          const pct  = c.disruptionScore != null ? ` — ${c.disruptionScore}% disruption` : '';
          const warn = c.activeWarnings  ? ` · ${c.activeWarnings} warnings` : '';
          return `${c.name}: ${c.status ?? 'monitored'}${pct}${warn}`;
        }),
      });
    }

    if (restChoke.length > 0) {
      cards.push({
        title: 'SHIPPING STATUS',
        severity: 'moderate',
        updatedAt,
        items: restChoke.map(c => {
          const cong = c.congestionLevel != null ? ` — congestion ${c.congestionLevel}%` : '';
          return `${c.name}: ${c.status ?? 'normal'}${cong}`;
        }),
      });
    }

    if (cards.length > 0) {
      sections.push({
        id: 'infrastructure',
        icon: '⬡',
        name: 'Infrastructure & Supply Chain',
        color: '#FF9000',
        cards,
      });
    }
  }

  // ── Military section (from theater posture) ──
  const theaters = theaterData?.theaters ?? theaterData?.postures ?? [];
  if (theaters.length > 0) {
    const cards: L2CardData[] = [];

    const postureItems = theaters.slice(0, 4).map(t => {
      const name    = t.theater ?? t.name ?? t.region ?? 'Unknown';
      const posture = t.postureLevel ?? t.status ?? 'nominal';
      const vessels = t.trackedVessels ? ` · ${t.trackedVessels} vessels` : '';
      const flights = t.activeFlights  ? ` · ${t.activeFlights} flights`  : '';
      return `${name}: ${posture}${vessels}${flights}`;
    });

    if (postureItems.length > 0) {
      const hasCritical = theaters.some(t =>
        (t.postureLevel ?? t.status ?? '').toLowerCase().match(/critical|high|elevated/)
      );
      cards.push({
        title: 'FORCE POSTURE',
        severity: hasCritical ? 'high' : 'moderate',
        updatedAt,
        items: postureItems,
      });
    }

    const opsItems = theaters
      .filter(t => t.activeOperations?.length)
      .slice(0, 3)
      .map(t => {
        const name = t.theater ?? t.name ?? t.region ?? 'Unknown';
        const ops  = t.activeOperations!.slice(0, 2).join(', ');
        return `${name}: ${ops}`;
      });

    if (opsItems.length > 0) {
      cards.push({
        title: 'ACTIVE OPERATIONS',
        severity: 'moderate',
        updatedAt,
        items: opsItems,
      });
    }

    if (cards.length > 0) {
      sections.push({
        id: 'military',
        icon: '⚔',
        name: 'Military & Defense',
        color: '#FF2040',
        cards,
      });
    }
  }

  // ── Cyber section (from threat feed) ──
  const threats = cyberData?.threats ?? [];
  if (threats.length > 0) {
    const cards: L2CardData[] = [];

    // Active threat actors
    const actorThreats = threats.filter(t => t.actor).slice(0, 4);
    if (actorThreats.length > 0) {
      cards.push({
        title: 'ACTIVE THREAT ACTORS',
        severity: 'high',
        updatedAt,
        items: actorThreats.map(t => {
          const actor  = t.actor ?? 'Unknown';
          const sector = t.targetSector ?? t.target ?? 'unknown sector';
          const type   = t.type ? `${formatCyberType(t.type)} against ` : '';
          return `${actor}: ${type}${sector}`;
        }),
      });
    }

    // High/critical severity threats
    const critThreats = threats
      .filter(t => ['critical', 'high'].includes((t.severity ?? '').toLowerCase()))
      .slice(0, 3);
    if (critThreats.length > 0) {
      cards.push({
        title: 'HIGH-SEVERITY THREATS',
        severity: 'critical',
        updatedAt,
        items: critThreats.map(t =>
          t.description ?? `${formatCyberType(t.type) || 'Threat'} targeting ${t.targetSector ?? t.target ?? 'infrastructure'}`
        ),
      });
    } else if (threats.length > 0 && cards.length < 2) {
      cards.push({
        title: 'THREAT LANDSCAPE',
        severity: 'moderate',
        updatedAt,
        items: threats.slice(0, 3).map(t =>
          t.description ?? `${formatCyberType(t.type) || 'Unknown'}: ${t.targetSector ?? t.target ?? 'unknown'}`
        ),
      });
    }

    if (cards.length > 0) {
      sections.push({
        id: 'cyber',
        icon: '⬢',
        name: 'Cyber Threat Landscape',
        color: '#CC44FF',
        cards,
      });
    }
  }

  const isLoading = !chopData && !theaterData && !cyberData;

  return (
    <div style={{ flexShrink: 0 }}>
      <L2Divider />

      {isLoading && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#4E6480',
          fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          Loading deep intelligence…
        </div>
      )}

      {!isLoading && sections.length === 0 && (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#4E6480',
          fontSize: 12,
          fontFamily: 'DM Sans, sans-serif',
        }}>
          No deep intelligence data available at this time
        </div>
      )}

      {sections.map((section) => (
        <L2Section key={section.id} section={section} />
      ))}
    </div>
  );
}
