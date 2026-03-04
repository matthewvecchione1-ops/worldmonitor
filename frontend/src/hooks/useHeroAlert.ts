import { useQuery } from '@tanstack/react-query';
import type { HeroAlert } from '../types/alert';

const MOCK_HERO_ALERT: HeroAlert = {
  id: 'alert-2026-03-01-iran',
  severity: 'critical',
  headline:
    'Iran Crisis — Day 2: IRGC at maximum readiness. Retaliation expected within 6–18h. Hormuz disruption imminent. Oil +2.8%, VIX +38%.',
  probability: 0.94,
  probabilityLabel: 'retaliatory strike',
  countryId: 'iran',
  timestamp: '2026-03-01T22:00:00Z',
  dismissed: false,
};

export function useHeroAlert() {
  return useQuery<HeroAlert>({
    queryKey: ['hero-alert'],
    queryFn: () => Promise.resolve(MOCK_HERO_ALERT),
    staleTime: Infinity,
  });
}
