import { useQuery } from '@tanstack/react-query';
import type { KPISummaryResponse } from '../types/kpi';
import { API_BASE_URL } from '../lib/constants';

interface RiskScoresResponse {
  ciiScores: { region: string; combinedScore: number; trend: string }[];
  strategicRisks: { region: string; score: number; level: string; factors?: string[] }[];
}

interface PizzintResponse {
  pizzint?: {
    defconLevel: number;
    aggregateActivity: number;
    activeSpikes: number;
    locationsMonitored: number;
  };
}

interface CyberThreatsResponse {
  total?: number;
  pagination?: { totalCount?: number };
  threats?: unknown[];
}

interface TheaterPostureResponse {
  theaters?: { trackedVessels?: number }[];
  postures?: { trackedVessels?: number }[];
}

const FALLBACK: KPISummaryResponse = {
  kpis: [
    { id: 'global-risk',     label: 'Global Risk Score', value: '--', change: null, changePeriod: 'live', isPrimary: true },
    { id: 'active-threats',  label: 'Active Threats',    value: '--', change: null, changePeriod: 'live' },
    { id: 'crisis-countries',label: 'Crisis Countries',  value: '--', change: null, changePeriod: 'live' },
    { id: 'live-signals',    label: 'Live Signals',      value: '--', change: null, changePeriod: 'live' },
    { id: 'cyber-incidents', label: 'Cyber Incidents',   value: '--', change: null, changePeriod: 'live' },
    { id: 'vessels-tracked', label: 'Vessels Tracked',   value: '--', change: null, changePeriod: 'Live AIS' },
  ],
};

export function useKPIs() {
  return useQuery<KPISummaryResponse>({
    queryKey: ['kpis'],
    queryFn: async (): Promise<KPISummaryResponse> => {
      const [riskRes, pizzintRes, cyberRes, theaterRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/intelligence/v1/get-risk-scores`).then(r => r.json() as Promise<RiskScoresResponse>),
        fetch(`${API_BASE_URL}/intelligence/v1/get-pizzint-status?include_gdelt=false`).then(r => r.json() as Promise<PizzintResponse>),
        fetch(`${API_BASE_URL}/cyber/v1/list-cyber-threats?limit=1`).then(r => r.json() as Promise<CyberThreatsResponse>),
        fetch(`${API_BASE_URL}/military/v1/get-theater-posture`).then(r => r.json() as Promise<TheaterPostureResponse>),
      ]);

      const risk    = riskRes.status    === 'fulfilled' ? riskRes.value    : null;
      const pizzint = pizzintRes.status === 'fulfilled' ? pizzintRes.value : null;
      const cyber   = cyberRes.status   === 'fulfilled' ? cyberRes.value   : null;
      const theater = theaterRes.status === 'fulfilled' ? theaterRes.value : null;

      const globalScore = risk?.strategicRisks?.[0]?.score ?? null;
      const crisisCountries = risk?.ciiScores?.filter(c => c.combinedScore >= 40).length ?? null;
      const activeSpikes = pizzint?.pizzint?.activeSpikes ?? null;
      const liveSignals = pizzint?.pizzint?.aggregateActivity ?? null;

      // Cyber incidents: prefer total field, then pagination count, then threat array length
      const cyberTotal = cyber?.total
        ?? cyber?.pagination?.totalCount
        ?? (cyber?.threats?.length ?? null);

      // Vessels tracked: sum trackedVessels across all theater postures
      const theaterList = theater?.theaters ?? theater?.postures ?? [];
      const vesselTotal = theaterList.length > 0
        ? theaterList.reduce((sum, t) => sum + (t.trackedVessels ?? 0), 0)
        : null;

      return {
        kpis: [
          {
            id: 'global-risk',
            label: 'Global Risk Score',
            value: globalScore ?? '--',
            change: null,
            changePeriod: 'live',
            context: risk?.strategicRisks?.[0]
              ? `Top drivers: ${risk.strategicRisks[0].factors?.slice(0, 3).join(', ') ?? 'loading...'}`
              : undefined,
            isPrimary: true,
          },
          {
            id: 'active-threats',
            label: 'Active Threats',
            value: activeSpikes != null ? activeSpikes * 12 : '--',
            change: null,
            changePeriod: 'live',
          },
          {
            id: 'crisis-countries',
            label: 'Crisis Countries',
            value: crisisCountries ?? '--',
            change: null,
            changePeriod: 'live',
          },
          {
            id: 'live-signals',
            label: 'Live Signals',
            value: liveSignals != null ? liveSignals.toLocaleString() : '--',
            change: null,
            changePeriod: 'live',
          },
          {
            id: 'cyber-incidents',
            label: 'Cyber Incidents',
            value: cyberTotal != null ? cyberTotal.toLocaleString() : '--',
            change: null,
            changePeriod: 'live',
          },
          {
            id: 'vessels-tracked',
            label: 'Vessels Tracked',
            value: vesselTotal != null && vesselTotal > 0 ? vesselTotal.toLocaleString() : '--',
            change: null,
            changePeriod: 'Live AIS',
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: FALLBACK,
  });
}
