import { useQuery } from '@tanstack/react-query';
import type { KPISummaryResponse } from '../types/kpi';

const MOCK_KPIS: KPISummaryResponse = {
  kpis: [
    {
      id: 'global-risk',
      label: 'Global Risk Score',
      value: 78,
      change: 12,
      changePeriod: '24h',
      context:
        'Highest since Feb 2022 Ukraine invasion. Driven by Iran decapitation strike and cascading retaliation risk.',
      isPrimary: true,
    },
    {
      id: 'active-threats',
      label: 'Active Threats',
      value: 247,
      change: 12,
      changePeriod: '1h',
    },
    {
      id: 'crisis-countries',
      label: 'Crisis Countries',
      value: 14,
      change: 3,
      changePeriod: '24h',
    },
    {
      id: 'live-signals',
      label: 'Live Signals',
      value: '1,847',
      change: 0,
      changePeriod: 'stable',
    },
    {
      id: 'cyber-incidents',
      label: 'Cyber Incidents',
      value: 38,
      change: 7,
      changePeriod: '6h',
    },
    {
      id: 'vessels-tracked',
      label: 'Vessels Tracked',
      value: 312,
      change: null,
      changePeriod: 'Live AIS',
    },
  ],
};

export function useKPIs() {
  return useQuery<KPISummaryResponse>({
    queryKey: ['kpis'],
    queryFn: () => Promise.resolve(MOCK_KPIS),
    staleTime: Infinity,
  });
}
