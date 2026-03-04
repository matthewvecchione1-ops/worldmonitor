import { useQuery } from '@tanstack/react-query';
import type { IntelFeedResponse, IntelItem } from '../types/intel';
import { API_BASE_URL } from '../lib/constants';

interface GdeltArticle {
  title: string;
  url: string;
  source: string;
  date: string;
  tone: number;
}

interface GdeltResponse {
  articles: GdeltArticle[];
  error?: string;
}

function toneToSeverity(tone: number): IntelItem['severity'] {
  if (tone < -5) return 'alert';
  if (tone < -2) return 'standard';
  return 'standard';
}

function sourceToTag(source: string): string[] {
  const s = source.toLowerCase();
  if (s.includes('cyber') || s.includes('threat') || s.includes('secur')) return ['CYBER'];
  if (s.includes('military') || s.includes('defense') || s.includes('war')) return ['MILITARY'];
  if (s.includes('market') || s.includes('financial') || s.includes('oil')) return ['MARKETS'];
  return ['INTEL'];
}

/**
 * Parse GDELT compact date format YYYYMMDDTHHMMSSZ (basic ISO 8601).
 * Standard `new Date()` doesn't parse compact format without hyphens in all engines.
 */
function parseGdeltDate(dateStr: string): Date {
  // GDELT seendate: '20260304T053000Z' → '2026-03-04T05:30:00Z'
  const m = dateStr.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  if (m) {
    return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`);
  }
  return new Date(dateStr); // fallback for already-formatted dates
}

function relativeTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = parseGdeltDate(dateStr);
    if (isNaN(d.getTime())) return '';
    const diff = (Date.now() - d.getTime()) / 1000 / 60;
    if (diff < 0) return 'just now';
    if (diff < 60) return `${Math.round(diff)}m`;
    if (diff < 1440) return `${Math.round(diff / 60)}h`;
    return `${Math.round(diff / 1440)}d`;
  } catch {
    return '';
  }
}

const FALLBACK_INTEL: IntelFeedResponse = {
  items: [
    { id: 'f1', source: 'LIVE FEED', headline: 'Connecting to intelligence feed…', severity: 'standard', tags: ['INTEL'], timestamp: '', isUrgent: false },
  ],
  total: 1,
  hasMore: false,
};

export function useIntelFeed(_limit = 50) {
  return useQuery<IntelFeedResponse>({
    queryKey: ['intel-feed'],
    queryFn: async (): Promise<IntelFeedResponse> => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/intelligence/v1/search-gdelt-documents?query=military+conflict+security+threat+sourcelang:eng&max_records=20&timespan=48h&sort=DateDesc`
        );
        if (!res.ok) return FALLBACK_INTEL;
        const data: GdeltResponse = await res.json();
        if (!data.articles?.length) return FALLBACK_INTEL;

        const items: IntelItem[] = data.articles.slice(0, _limit).map((a, i) => ({
          id: `gdelt-${i}`,
          source: (a.source ?? 'GDELT').toUpperCase(),
          headline: a.title,
          severity: toneToSeverity(a.tone),
          tags: sourceToTag(a.source ?? ''),
          timestamp: relativeTime(a.date),
          isUrgent: a.tone < -6,
          url: a.url,
        }));

        return { items, total: items.length, hasMore: false };
      } catch {
        return FALLBACK_INTEL;
      }
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  });
}
