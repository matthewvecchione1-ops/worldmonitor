import { useQuery } from '@tanstack/react-query';
import type { KPISummaryResponse } from '../types/kpi';
import { API_BASE_URL } from '../lib/constants';

interface RiskScoresResponse {
  ciiScores: { region: string; combinedScore: number; trend: string }[];
  strategicRisks: { region: string; score: number; level: string }[];
}

interface PizzintResponse {
  pizzint?: {
    defconLevel: number;
    aggregateActivity: number;
    activeSpikes: number;
    locationsMonitored: number;
  };
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
      const [riskRes, pizzintRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/intelligence/v1/get-risk-scores`).then(r => r.json() as Promise<RiskScoresResponse>),
        fetch(`${API_BASE_URL}/intelligence/v1/get-pizzint-status?include_gdelt=false`).then(r => r.json() as Promise<PizzintResponse>),
      ]);

      const risk = riskRes.status === 'fulfilled' ? riskRes.value : null;
      const pizzint = pizzintRes.status === 'fulfilled' ? pizzintRes.value : null;

      const globalScore = risk?.strategicRisks?.[0]?.score ?? null;
      const crisisCountries = risk?.ciiScores?.filter(c => c.combinedScore >= 40).length ?? null;
      const activeSpikes = pizzint?.pizzint?.activeSpikes ?? null;
      const liveSignals = pizzint?.pizzint?.aggregateActivity ?? null;

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
            value: '--',
            change: null,
            changePeriod: 'live',
          },
          {
            id: 'vessels-tracked',
            label: 'Vessels Tracked',
            value: '--',
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
