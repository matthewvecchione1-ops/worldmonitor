export type IntelSeverity = 'alert' | 'breaking' | 'standard';

export interface IntelItem {
  id: string;
  source: string;
  headline: string;
  severity: IntelSeverity;
  tags: string[];
  timestamp: string;
  url?: string;
  relatedCountry?: string;
  isUrgent?: boolean;
}

export interface IntelFeedResponse {
  items: IntelItem[];
  total: number;
  hasMore: boolean;
}

export interface TrendingSignal {
  id: string;
  text: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  timestamp: string;
  source: string;
}

export type IntelCardDomain = 'infrastructure' | 'financial' | 'military' | 'cyber';

export interface CardContent {
  type: 'text' | 'stat' | 'list' | 'bar';
  label?: string;
  value?: string | number;
  items?: string[];
  color?: string;
}

export interface IntelCard {
  id: string;
  title: string;
  domain: IntelCardDomain;
  content: CardContent[];
  severity: string;
  lastUpdated: string;
}
