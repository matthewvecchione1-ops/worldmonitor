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
  return new Date(dateStr);
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

const FALLBACK_NEWS: IntelFeedResponse = {
  items: [
    { id: 'fn1', source: 'LIVE FEED', headline: 'Connecting to world news feed…', severity: 'standard', tags: ['NEWS'], timestamp: '', isUrgent: false },
  ],
  total: 1,
  hasMore: false,
};

export function useWorldNews(_limit = 50) {
  return useQuery<IntelFeedResponse>({
    queryKey: ['world-news'],
    queryFn: async (): Promise<IntelFeedResponse> => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/intelligence/v1/search-gdelt-documents?query=world+news+geopolitics+diplomacy+sourcelang:eng&max_records=20&timespan=72h&sort=DateDesc`
        );
        if (!res.ok) return FALLBACK_NEWS;
        const data: GdeltResponse = await res.json();
        if (!data.articles?.length) return FALLBACK_NEWS;

        const items: IntelItem[] = data.articles.slice(0, _limit).map((a, i) => ({
          id: `news-${i}`,
          source: (a.source ?? 'NEWS').toUpperCase(),
          headline: a.title,
          severity: (a.tone < -4 ? 'breaking' : a.tone < -1 ? 'alert' : 'standard') as IntelItem['severity'],
          tags: [a.tone < -4 ? 'BREAKING' : 'NEWS'],
          timestamp: relativeTime(a.date),
          isUrgent: a.tone < -6,
          url: a.url,
        }));

        return { items, total: items.length, hasMore: false };
      } catch {
        return FALLBACK_NEWS;
      }
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  });
}
