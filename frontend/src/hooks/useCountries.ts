import { useQuery } from '@tanstack/react-query';
import type { CountryInstabilityResponse, CountryDossier } from '../types/country';
import { API_BASE_URL } from '../lib/constants';

interface CiiScore {
  region: string;
  combinedScore: number;
  staticBaseline: number;
  dynamicScore: number;
  trend: string;
}

interface RiskScoresResponse {
  ciiScores: CiiScore[];
  strategicRisks: { region: string; score: number; level: string; factors: string[] }[];
}

interface CountryIntelBriefResponse {
  countryCode: string;
  countryName: string;
  brief: string;
  model: string;
  generatedAt: number;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', RU: 'Russia', CN: 'China', UA: 'Ukraine',
  IR: 'Iran', IL: 'Israel', TW: 'Taiwan', KP: 'North Korea',
  SA: 'Saudi Arabia', TR: 'Turkey', PL: 'Poland', DE: 'Germany',
  FR: 'France', GB: 'United Kingdom', IN: 'India', PK: 'Pakistan',
  SY: 'Syria', YE: 'Yemen', MM: 'Myanmar', VE: 'Venezuela',
};

const FALLBACK_COUNTRIES: CountryInstabilityResponse = {
  countries: [
    { id: 'ru', name: 'Russia',    score: 0, change: 0, trend: 'stable' },
    { id: 'cn', name: 'China',     score: 0, change: 0, trend: 'stable' },
    { id: 'ua', name: 'Ukraine',   score: 0, change: 0, trend: 'stable' },
    { id: 'ir', name: 'Iran',      score: 0, change: 0, trend: 'stable' },
    { id: 'kp', name: 'North Korea', score: 0, change: 0, trend: 'stable' },
  ],
};

export function useCountries(_limit = 20) {
  return useQuery<CountryInstabilityResponse>({
    queryKey: ['countries-instability'],
    queryFn: async (): Promise<CountryInstabilityResponse> => {
      try {
        const res = await fetch(`${API_BASE_URL}/intelligence/v1/get-risk-scores`);
        if (!res.ok) return FALLBACK_COUNTRIES;
        const data: RiskScoresResponse = await res.json();
        if (!data.ciiScores?.length) return FALLBACK_COUNTRIES;

        const countries = data.ciiScores
          .slice(0, _limit)
          .map((c) => {
            const trend: 'up' | 'down' | 'stable' =
              c.trend === 'TREND_DIRECTION_RISING' ? 'up'
              : c.trend === 'TREND_DIRECTION_FALLING' ? 'down'
              : 'stable';
            return {
              id: c.region.toLowerCase(),
              name: COUNTRY_NAMES[c.region] ?? c.region,
              score: c.combinedScore,
              change: c.dynamicScore,
              trend,
            };
          });

        return { countries };
      } catch {
        return FALLBACK_COUNTRIES;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCountryDossier(id: string | null) {
  return useQuery<CountryDossier | null>({
    queryKey: ['country-dossier', id],
    queryFn: async (): Promise<CountryDossier | null> => {
      if (!id) return null;
      const code = id.toUpperCase();
      const displayName = COUNTRY_NAMES[code] || code;

      try {
        const briefRes = await fetch(
          `${API_BASE_URL}/intelligence/v1/get-country-intel-brief?country_code=${code}`
        );
        if (!briefRes.ok) throw new Error('brief unavailable');
        const brief: CountryIntelBriefResponse = await briefRes.json();

        return {
          id,
          name: brief.countryName || displayName,
          officialName: brief.countryName || displayName,
          region: '',
          population: '',
          flagEmoji: '',
          riskScore: 0,
          riskChange: 0,
          riskLevel: 'moderate',
          situation: brief.brief || 'Intelligence brief unavailable.',
          stats: [],
          entities: [],
          timeline: [],
          financial: { markets: '', sanctions: '', trade: '', currency: '' },
          predictions: [],
          military: { summary: '', assets: [], readiness: '' },
          theaterAssets: [],
        };
      } catch {
        return {
          id,
          name: displayName,
          officialName: displayName,
          region: '',
          population: '',
          flagEmoji: '',
          riskScore: 0,
          riskChange: 0,
          riskLevel: 'moderate',
          situation: 'Intelligence brief temporarily unavailable. Check back shortly.',
          stats: [],
          entities: [],
          timeline: [],
          financial: { markets: '', sanctions: '', trade: '', currency: '' },
          predictions: [],
          military: { summary: '', assets: [], readiness: '' },
          theaterAssets: [],
        };
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
    enabled: id !== null,
  });
}
