import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SearchResponse } from '../types/api';
import { get } from '../lib/api';

export function useSearch() {
  const [query, setQuery] = useState('');

  const results = useQuery<SearchResponse>({
    queryKey: ['search', query],
    queryFn: () => get<SearchResponse>(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.length > 1,
  });

  return { query, setQuery, results };
}
