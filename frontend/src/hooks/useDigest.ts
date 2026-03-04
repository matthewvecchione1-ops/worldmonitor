import { useQuery } from '@tanstack/react-query';
import type { DigestBrief } from '../types/digest';

// ── Mock data — WIM prototype Digest Brief ────────────────────────────────

const MOCK_DIGEST: DigestBrief = {
  headline: 'IRAN CRISIS — DAY 2',
  subline:
    'The most significant geopolitical event since Russia\'s invasion of Ukraine. Retaliation is near-certain. Here\'s what matters, what\'s happening right now, and what comes next.',
  timestamp: 'SUN 01 MAR 2026 · 22:00 UTC · UPDATED 2 MIN AGO',
  threatLevel: 92,
  threatLabel: 'CRITICAL',
  threatSummary:
    'The most significant military escalation in the Middle East since 2003. US-Israeli strikes have decapitated Iranian leadership and triggered cascading retaliation risk across the proxy network. Global risk at highest level since February 2022 Ukraine invasion.',
  threatMetrics: '247 active signals · 14 crisis countries · Oil +2.8% · VIX +38%',

  temporal: {
    past: [
      { time: '14h ago', text: 'US-Israeli coordinated strikes launched on 30+ Iranian targets across 3 provinces' },
      { time: '12h ago', text: 'Supreme Leader Khamenei confirmed dead by Iranian state media' },
      { time: '10h ago', text: 'Iranian airspace closed to all civil aviation; 47 commercial flights rerouted' },
      { time: '8h ago',  text: 'IRGC declares maximum readiness — retaliatory posture officially confirmed' },
      { time: '6h ago',  text: 'Oil surges past $67; Brent crude up 3.1%, VIX spikes +38%' },
    ],
    now: [
      { text: 'IRGC Aerospace Force repositioning Shahab-3 TELs near Dezful', isActive: true },
      { text: '8 IRGC fast attack boats deployed in Strait of Hormuz', isActive: true },
      { text: 'APT33 wiper malware targeting Gulf state energy infrastructure', isActive: true },
      { text: 'Hezbollah emergency leadership session underway in Beirut', isActive: true },
      { text: 'Mass displacement from Isfahan and Tehran suburbs (~240K)', isActive: true },
    ],
    next: [
      { text: 'Iranian retaliatory strike on US/Israeli assets',         probability: 0.94, timeframe: '6–18h'    },
      { text: 'Proxy rocket attacks on US bases in Iraq/Syria',          probability: 0.82, timeframe: '12–24h'   },
      { text: 'Hormuz partial closure or mine deployment',               probability: 0.72, timeframe: '24–72h'   },
      { text: 'Hezbollah rocket barrage on northern Israel',             probability: 0.68, timeframe: '24–48h'   },
      { text: 'Major cyber attack on US/Gulf critical infrastructure',   probability: 0.55, timeframe: '3–7 days' },
    ],
  },

  storyArcs: [
    {
      title: 'PRIMARY ESCALATION PATH',
      chain: ['US-Israeli Strike', 'Khamenei Dead', 'IRGC Retaliation', 'Proxy Activation', 'Regional War'],
      chainColors: ['#FF2040', '#FF2040', '#FF6020', '#FF6020', '#FF2040'],
      severity: 'crit',
      body:
        'The strikes decapitated Iranian leadership for the first time in the Republic\'s history. IRGC doctrine requires a retaliatory response — not responding would destroy internal legitimacy. Proxies (Hezbollah, Houthis, PMF) will likely coordinate a multi-front response within 48 hours.',
      soWhat:
        'This is now a multi-front escalation spiral. Each retaliatory step by Iran triggers Israeli/US counter-response. De-escalation requires diplomatic intervention that doesn\'t yet exist. Monitor UNSC emergency session and back-channel communications via Oman and Qatar.',
    },
    {
      title: 'ECONOMIC CONTAGION PATH',
      chain: ['Hormuz Threat', 'Oil Spike', 'Shipping Reroute', 'Insurance Surge', 'Supply Chain Crisis'],
      chainColors: ['#FF2040', '#00D878', '#FF9000', '#FF6020', '#FF6020'],
      severity: 'eco',
      body:
        'Even without a full Hormuz closure, the credible threat alone has rerouted 4 tankers via Cape of Good Hope, adding +10 days transit time. War risk insurance premiums have tripled. If sustained beyond 72 hours, downstream effects on European energy markets become severe.',
      soWhat:
        'Energy supply chain disruption is already underway and does not require a full closure to cause significant damage. The insurance premium spike is the key leading indicator — if premiums exceed 3% of cargo value, expect 60–70% of tankers to reroute automatically.',
    },
  ],

  watchItems: [
    { rank: 1, text: 'IRGC missile launch indicators from western Iran TEL sites',        urgency: 'IMMINENT', rationale: '3 Shahab-3 TELs repositioned near Dezful in last 4h' },
    { rank: 2, text: 'Hormuz mine-laying activity from IRGC naval units',                 urgency: 'IMMINENT', rationale: '8 fast attack boats deployed; mine inventory at Bandar Abbas' },
    { rank: 3, text: 'Hezbollah mobilization along Israel-Lebanon border',                urgency: 'HIGH',     rationale: 'Emergency leadership session underway; 150K+ rockets in inventory' },
    { rank: 4, text: 'APT33/APT35 cyber operations against US critical infrastructure',   urgency: 'HIGH',     rationale: 'Wiper malware already deployed against Gulf energy targets' },
    { rank: 5, text: 'Houthi anti-ship missile targeting in Red Sea / Bab el-Mandeb',     urgency: 'ELEVATED', rationale: 'SSM sites in Hodeidah on elevated alert; USN escort required' },
  ],
};

// ── Hook ─────────────────────────────────────────────────────────────────

export function useDigest() {
  return useQuery<DigestBrief>({
    queryKey: ['digest'],
    queryFn: async () => MOCK_DIGEST,
    staleTime: Infinity,
  });
}
