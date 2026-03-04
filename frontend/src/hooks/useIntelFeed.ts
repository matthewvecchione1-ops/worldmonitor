import { useQuery } from '@tanstack/react-query';
import type { IntelFeedResponse } from '../types/intel';

// ── Mock data — WIM prototype Intel Feed ────────────────────────────────

const MOCK_INTEL: IntelFeedResponse = {
  items: [
    {
      id: '1',
      source: 'THE WAR ZONE',
      headline: 'U.S.–Israeli War With Iran Enters Day Two — strikes across 3 provinces',
      severity: 'alert',
      tags: ['ALERT', 'MILITARY'],
      timestamp: '2h',
      isUrgent: true,
    },
    {
      id: '2',
      source: 'BBC WORLD',
      headline: 'Khamenei confirmed dead by state media; Iran launches retaliatory strikes',
      severity: 'alert',
      tags: ['ALERT'],
      timestamp: '4h',
      isUrgent: true,
    },
    {
      id: '3',
      source: 'RANSOMWARE.LIVE',
      headline: 'APT33 deploys wiper malware targeting Gulf state energy infrastructure',
      severity: 'standard',
      tags: ['CYBER'],
      timestamp: '5h',
      isUrgent: false,
    },
    {
      id: '4',
      source: 'REUTERS',
      headline: 'Oil surges past $70 as Hormuz transit risk spikes; Brent up 4.2%',
      severity: 'standard',
      tags: ['MARKETS'],
      timestamp: '6h',
      isUrgent: false,
    },
    {
      id: '5',
      source: 'JANES',
      headline: 'Satellite imagery confirms 3 Shahab-3 TELs repositioned near Dezful',
      severity: 'standard',
      tags: ['MILITARY'],
      timestamp: '7h',
      isUrgent: false,
    },
    {
      id: '6',
      source: 'FLIGHT RADAR',
      headline: '47 commercial flights rerouted as Iran closes entire airspace',
      severity: 'standard',
      tags: ['ALERT'],
      timestamp: '8h',
      isUrgent: false,
    },
    {
      id: '7',
      source: 'AL JAZEERA',
      headline: 'Hezbollah leadership meets in emergency session; border tensions rise',
      severity: 'standard',
      tags: ['CONFLICT'],
      timestamp: '9h',
      isUrgent: false,
    },
    {
      id: '8',
      source: 'MARITIME EXEC',
      headline: '4 tankers reverse course at Hormuz; war risk insurance premiums triple',
      severity: 'standard',
      tags: ['MARKETS'],
      timestamp: '10h',
      isUrgent: false,
    },
  ],
  total: 8,
  hasMore: false,
};

// ── Hook ─────────────────────────────────────────────────────────────────

export function useIntelFeed(_limit = 50) {
  return useQuery<IntelFeedResponse>({
    queryKey: ['intel-feed'],
    queryFn: async () => MOCK_INTEL,
    staleTime: Infinity,
  });
}
