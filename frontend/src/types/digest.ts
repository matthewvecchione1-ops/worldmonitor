export type WatchUrgency = 'IMMINENT' | 'HIGH' | 'ELEVATED' | 'MONITOR';
export type StoryArcSeverity = 'crit' | 'high' | 'eco' | 'cyb';

export interface DigestTemporalItem {
  time?: string;
  text: string;
  isActive?: boolean;
  probability?: number;
  timeframe?: string;
}

export interface StoryArc {
  title: string;
  chain: string[];
  chainColors: string[];
  severity: StoryArcSeverity;
  body: string;
  soWhat: string;
}

export interface WatchItem {
  rank: number;
  text: string;
  urgency: WatchUrgency;
  rationale: string;
}

export interface DigestBrief {
  headline: string;
  subline: string;
  timestamp: string;
  threatLevel: number;
  threatLabel: string;
  threatSummary: string;
  threatMetrics: string;
  temporal: {
    past: DigestTemporalItem[];
    now: DigestTemporalItem[];
    next: DigestTemporalItem[];
  };
  storyArcs: StoryArc[];
  watchItems: WatchItem[];
}
