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

function relativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const diff = (Date.now() - d.getTime()) / 1000 / 60;
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
          `${API_BASE_URL}/intelligence/v1/search-gdelt-documents?query=world+news+geopolitics+diplomacy+sourcelang:english&max_records=20&timespan=72h&sort=date`
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
