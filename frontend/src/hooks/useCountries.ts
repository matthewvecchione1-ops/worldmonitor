import { useQuery } from '@tanstack/react-query';
import type { CountryInstabilityResponse, CountryDossier } from '../types/country';

// ── Mock data — WIM prototype Country Instability ────────────────────────

const MOCK_COUNTRIES: CountryInstabilityResponse = {
  countries: [
    { id: 'iran',        name: 'Iran',        score: 92, change: 18, trend: 'up' },
    { id: 'ukraine',     name: 'Ukraine',     score: 78, change:  0, trend: 'stable' },
    { id: 'taiwan',      name: 'Taiwan',      score: 65, change:  8, trend: 'up' },
    { id: 'lebanon',     name: 'Lebanon',     score: 60, change:  5, trend: 'up' },
    { id: 'afghanistan', name: 'Afghanistan', score: 60, change:  0, trend: 'stable' },
    { id: 'syria',       name: 'Syria',       score: 58, change:  0, trend: 'stable' },
    { id: 'yemen',       name: 'Yemen',       score: 55, change:  3, trend: 'up' },
    { id: 'somalia',     name: 'Somalia',     score: 52, change:  0, trend: 'stable' },
    { id: 'myanmar',     name: 'Myanmar',     score: 48, change: -2, trend: 'down' },
    { id: 'sudan',       name: 'Sudan',       score: 45, change:  0, trend: 'stable' },
  ],
};

// ── Mock data — Iran Country Dossier ─────────────────────────────────────

const MOCK_IRAN_DOSSIER: CountryDossier = {
  id: 'iran',
  name: 'Iran',
  officialName: 'Islamic Republic of Iran',
  region: 'Middle East',
  population: '88.5M',
  flagEmoji: '🇮🇷',
  riskScore: 92,
  riskChange: 18,
  riskLevel: 'critical',

  situation:
    'US-Israeli forces conducted coordinated multi-site strikes across Iran overnight targeting military, nuclear, and command infrastructure. Supreme Leader Khamenei confirmed dead — the first such event in the Islamic Republic\'s history. IRGC has declared maximum readiness and retaliatory posture. Iranian airspace closed to all civil aviation. Significant internal displacement underway from Isfahan, Bushehr, and Tehran suburbs. Oil infrastructure fires burning at multiple sites. Proxy network (Hezbollah, Houthis, PMF) on elevated alert.',

  stats: [
    { label: 'Risk Score',     value: '92 / 100',        change: '↑ +18',   valueColor: '#FF2040' },
    { label: 'Active Signals', value: '247',             change: '↑ +84'   },
    { label: 'News Volume',    value: '50 articles (6h)',change: '↑ 10x'   },
    { label: 'Displacement',   value: '~240,000 new',    change: '↑ NEW',   valueColor: '#FF6020' },
    { label: 'Airspace',       value: 'CLOSED',          change: null,      valueColor: '#FF2040' },
    { label: 'Internet',       value: '42% of normal',   change: '↓',       valueColor: '#FF6020' },
    { label: 'Currency (IRR)', value: '612,400/USD',     change: '↑ +8.6%' },
    { label: 'Cyber Posture',  value: 'APT33 active',    change: null,      valueColor: '#CC44FF' },
  ],

  entities: [
    { id: 'irgc',      name: 'IRGC',              type: 'Military Arm',    icon: '⚔️', risk: 94 },
    { id: 'hezbollah', name: 'Hezbollah',          type: 'Proxy · Lebanon', icon: '🎯', risk: 74 },
    { id: 'houthis',   name: 'Houthis',            type: 'Proxy · Yemen',   icon: '🎯', risk: 68 },
    { id: 'pmf',       name: 'PMF / Iraq Militias', type: 'Proxy · Iraq',   icon: '🎯', risk: 62 },
    { id: 'natanz',    name: 'Natanz Facility',    type: 'Nuclear',         icon: '☢️', risk: 76 },
    { id: 'hormuz',    name: 'Strait of Hormuz',   type: 'Chokepoint',      icon: '⚓', risk: 88 },
    { id: 'apt33',     name: 'APT33 / Elfin',      type: 'Cyber · IRGC',   icon: '💻', risk: 71 },
    { id: 'russia',    name: 'Russia',             type: 'Ally',            icon: '🇷🇺', risk: 55 },
    { id: 'china',     name: 'China',              type: 'Oil buyer',       icon: '🇨🇳', risk: 48 },
  ],

  timeline: [
    { time: '2h ago',  text: 'US-Israeli strikes hit 30+ targets across Isfahan, Bushehr, Tehran Province',  severity: 'critical', sources: 'The War Zone · BBC · AP'         },
    { time: '4h ago',  text: 'Supreme Leader Khamenei confirmed dead by Iranian state media',                severity: 'critical', sources: 'IRNA · Press TV · Reuters'        },
    { time: '5h ago',  text: 'IRGC declares "maximum readiness" — retaliatory posture confirmed',           severity: 'critical', sources: 'IRGC Telegram · Fars News'        },
    { time: '6h ago',  text: 'Iranian airspace closed to all civil aviation; 47 commercial flights rerouted', severity: 'high',   sources: 'Eurocontrol · FlightRadar24'      },
    { time: '8h ago',  text: 'APT33 phishing campaign detected targeting US defense contractors',            severity: 'high',   sources: 'CrowdStrike · Mandiant'           },
    { time: '10h ago', text: 'Oil infrastructure fires reported at Bushehr and Isfahan refineries',          severity: 'high',   sources: 'Satellite imagery · FIRMS · Reuters' },
    { time: '14h ago', text: 'US carrier strike group repositioned in Gulf of Oman',                        severity: 'moderate', sources: 'OSINT · AIS tracking'             },
    { time: '18h ago', text: 'President addresses nation on Iran operations; cites nuclear threat',          severity: 'low',    sources: 'CNN · C-SPAN · Reuters'           },
  ],

  financial: {
    markets:   'WTI Crude +2.78% ($67.02) · Brent +3.12% ($71.44) · Gold +1.03% ($5,248) · VIX ↑ +38% (28.4) · Defense ETFs ITA +4.2%',
    sanctions: 'OFAC comprehensive sanctions in effect. EU oil embargo active. SWIFT access restricted for major Iranian banks. China/India partial compliance. Secondary sanctions risk elevated for Gulf intermediaries.',
    trade:     '4 tankers rerouted from Hormuz. War risk insurance premiums surged 300%. Container rates Shanghai–ME corridor +12%. Suez transit delays 4–6h due to elevated security screening.',
    currency:  'IRR 612,400/USD · +8.6% depreciation (24h) · Black market premium at record high · Central bank intervention suspended',
  },

  predictions: [
    { event: 'Iranian retaliatory strike on US/Israeli assets',  probability: 0.94, timeline: 'Within 18 hours', confidence: 'Near-certain' },
    { event: 'Strait of Hormuz partial closure or mining',       probability: 0.72, timeline: 'Within 72 hours', confidence: 'Likely'       },
    { event: 'Hezbollah rocket barrage on northern Israel',      probability: 0.67, timeline: 'Within 48 hours', confidence: 'Probable'     },
    { event: 'Internal power struggle / succession crisis',      probability: 0.58, timeline: 'Within 7 days',   confidence: 'Possible'     },
    { event: 'Full Hormuz blockade (>72h)',                      probability: 0.31, timeline: 'Within 2 weeks',  confidence: 'Possible'     },
  ],

  military: {
    summary: 'IRGC at maximum readiness. Navy deployed in Strait of Hormuz and Gulf of Oman. Missile TEL activity detected at 3 sites. Proxy network (Hezbollah, Houthis, PMF) on elevated alert.',
    assets: [
      'IRGC Ground Forces — Maximum readiness posture',
      'IRGC Navy — Hormuz + Gulf of Oman deployed',
      'Shahab-3 / Emad / Khorramshahr TELs — 3 active sites',
      'Shahed-136 + Mohajer-6 Drones — Stockpile intact',
      'S-300 / Tor-M1 Air Defense — Active intercept posture',
      'APT33 Cyber Unit — Phishing campaign active',
    ],
    readiness: 'MAXIMUM — Full retaliatory posture declared',
  },

  theaterAssets: [
    { id: 'strike-tehran',  lat: 35.69, lng: 51.39, type: 'hostile', name: 'Tehran IRGC HQ',        detail: 'STRUCK wave 1 · Partially destroyed', status: 'STRUCK',  statusColor: '#FF2040' },
    { id: 'strike-isfahan', lat: 32.65, lng: 51.68, type: 'hostile', name: 'Isfahan Military Complex', detail: '12 targets struck · Secondary explosions', status: 'STRUCK', statusColor: '#FF2040' },
    { id: 'natanz-fep',     lat: 33.72, lng: 51.72, type: 'nuclear', name: 'Natanz (FEP)',           detail: 'Strike damage: PENDING', status: 'NUCLEAR', statusColor: '#FFD000' },
    { id: 'fordow-ffep',    lat: 34.88, lng: 51.98, type: 'nuclear', name: 'Fordow (FFEP)',          detail: 'Underground · Likely survived', status: 'NUCLEAR', statusColor: '#FFD000' },
  ],
};

// ── Hooks ─────────────────────────────────────────────────────────────────

export function useCountries(_limit = 20) {
  return useQuery<CountryInstabilityResponse>({
    queryKey: ['countries-instability'],
    queryFn: async () => MOCK_COUNTRIES,
    staleTime: Infinity,
  });
}

export function useCountryDossier(id: string | null) {
  return useQuery<CountryDossier>({
    queryKey: ['country-dossier', id],
    queryFn: async () => {
      // Mock: return Iran dossier for 'iran', otherwise Iran as placeholder
      return MOCK_IRAN_DOSSIER;
    },
    staleTime: Infinity,
    enabled: id !== null,
  });
}
