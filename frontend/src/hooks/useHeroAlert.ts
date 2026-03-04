import { useQuery } from '@tanstack/react-query';
import type { HeroAlert } from '../types/alert';
import { API_BASE_URL } from '../lib/constants';

interface PizzintResponse {
  pizzint?: {
    defconLevel: number;
    defconLabel: string;
    aggregateActivity: number;
    activeSpikes: number;
    locationsMonitored: number;
  };
  tensionPairs: { country1: string; country2: string; tension: number; summary: string }[];
}

interface RiskScoresResponse {
  ciiScores: { region: string; combinedScore: number; trend: string }[];
  strategicRisks: { region: string; score: number; level: string; factors: string[] }[];
}

export function useHeroAlert() {
  return useQuery<HeroAlert | null>({
    queryKey: ['hero-alert'],
    queryFn: async (): Promise<HeroAlert | null> => {
      const [pizzintRes, riskRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/intelligence/v1/get-pizzint-status?include_gdelt=true`).then(r => r.json() as Promise<PizzintResponse>),
        fetch(`${API_BASE_URL}/intelligence/v1/get-risk-scores`).then(r => r.json() as Promise<RiskScoresResponse>),
      ]);

      const pizzint = pizzintRes.status === 'fulfilled' ? pizzintRes.value : null;
      const risk = riskRes.status === 'fulfilled' ? riskRes.value : null;

      const globalScore = risk?.strategicRisks?.[0]?.score ?? 0;
      const topCountry = risk?.ciiScores?.[0];
      const topTension = pizzint?.tensionPairs?.[0];

      // Only show hero alert if risk is elevated
      if (globalScore < 30 && !topTension) return null;

      const severity: HeroAlert['severity'] =
        globalScore >= 70 ? 'critical' : globalScore >= 50 ? 'high' : 'medium';

      const topFactors = risk?.strategicRisks?.[0]?.factors?.slice(0, 3).join(', ') ?? '';
      const tensionText = topTension
        ? `${topTension.country1}–${topTension.country2} tensions elevated. `
        : '';
      const countryText = topCountry
        ? `${topCountry.region} instability at ${topCountry.combinedScore}/100. `
        : '';

      return {
        id: `alert-live-${Date.now()}`,
        severity,
        headline: `Global Risk Score ${globalScore}/100. ${countryText}${tensionText}Key drivers: ${topFactors}.`,
        probability: globalScore / 100,
        probabilityLabel: 'global instability',
        countryId: topCountry?.region?.toLowerCase() ?? null,
        timestamp: new Date().toISOString(),
        dismissed: false,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
