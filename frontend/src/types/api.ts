/** Generic API error response */
export interface APIError {
  error: true;
  code: string;
  message: string;
}

/** Generic API success wrapper (when needed) */
export interface APIResponse<T> {
  data: T;
  timestamp?: string;
}

/** Search result types */
export type SearchResultType = 'country' | 'entity' | 'signal';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  name: string;
  score?: number;
  subtype?: string;
  headline?: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

/** Analyst query */
export interface AnalystRequest {
  question: string;
  context: {
    activeCountry?: string;
    currentThreatLevel?: number;
    recentSignals?: string[];
  };
  stream?: boolean;
}

export interface AnalystResponse {
  answer: string;
  sources: string[];
  confidence: number;
  model: string;
}

/** WebSocket event types */
export type WSEventType =
  | 'alert:hero'
  | 'intel:new'
  | 'market:tick'
  | 'country:score'
  | 'signal:new'
  | 'kpi:update';

export interface WSEvent<T = unknown> {
  event: WSEventType;
  data: T;
}
