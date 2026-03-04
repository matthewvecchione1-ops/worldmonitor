import { useQuery } from '@tanstack/react-query';
import type { IntelFeedResponse } from '../types/intel';

// ── Mock data — WIM prototype World News ─────────────────────────────────

const MOCK_WORLD_NEWS: IntelFeedResponse = {
  items: [
    {
      id: 'wn1',
      source: 'REUTERS',
      headline: 'G7 emergency session convened; multilateral response under discussion',
      severity: 'breaking',
      tags: ['BREAKING'],
      timestamp: '1h',
      isUrgent: true,
    },
    {
      id: 'wn2',
      source: 'UN NEWS',
      headline: 'Security Council veto blocks ceasefire resolution for third time',
      severity: 'alert',
      tags: ['DIPLOMACY'],
      timestamp: '3h',
      isUrgent: false,
    },
    {
      id: 'wn3',
      source: 'XINHUA',
      headline: 'China calls for restraint and dialogue; naval assets repositioned near Taiwan',
      severity: 'standard',
      tags: ['MILITARY'],
      timestamp: '5h',
      isUrgent: false,
    },
    {
      id: 'wn4',
      source: 'TASS',
      headline: 'Russia suspends arms limitation treaty in response to NATO posture shift',
      severity: 'standard',
      tags: ['MILITARY'],
      timestamp: '7h',
      isUrgent: false,
    },
    {
      id: 'wn5',
      source: 'NDTV',
      headline: 'India–Pakistan LoC sees elevated artillery activity amid regional tensions',
      severity: 'standard',
      tags: ['CONFLICT'],
      timestamp: '9h',
      isUrgent: false,
    },
    {
      id: 'wn6',
      source: 'NIKKEI',
      headline: 'Japan activates Self-Defense Forces; Aegis destroyers placed on high alert',
      severity: 'standard',
      tags: ['MILITARY'],
      timestamp: '11h',
      isUrgent: false,
    },
    {
      id: 'wn7',
      source: 'AFRICOM',
      headline: 'Niger–Mali junta coalition expels remaining U.S. military advisors from bases',
      severity: 'standard',
      tags: ['CONFLICT'],
      timestamp: '14h',
      isUrgent: false,
    },
  ],
  total: 7,
  hasMore: false,
};

// ── Hook ──────────────────────────────────────────────────────────────────

export function useWorldNews(_limit = 50) {
  return useQuery<IntelFeedResponse>({
    queryKey: ['world-news'],
    queryFn: async () => MOCK_WORLD_NEWS,
    staleTime: Infinity,
  });
}
