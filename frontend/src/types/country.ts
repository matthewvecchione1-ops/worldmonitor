import type { MapAsset } from './map';

export type CountryRiskLevel = 'critical' | 'high' | 'elevated' | 'moderate' | 'low';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface CountryScore {
  id: string;
  name: string;
  score: number;
  change: number;
  trend: TrendDirection;
  primaryDriver?: string;
}

export interface CountryInstabilityResponse {
  countries: CountryScore[];
}

export interface CountryStatRow {
  label: string;
  value: string;
  change: string | null;
  valueColor?: string;   // optional hex color override for the value cell
}

export interface RelatedEntity {
  id: string;
  name: string;
  type: string;
  icon: string;
  risk: number;
}

export interface TimelineEvent {
  time: string;
  text: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  sources: string;
}

export interface FinancialImpact {
  markets?: string;
  sanctions?: string;
  trade?: string;
  currency?: string;
}

export interface Prediction {
  event: string;
  probability: number;
  timeline: string;
  confidence: string;
}

export interface MilitaryPosture {
  summary?: string;
  assets?: string[];
  readiness?: string;
}

export interface CountryDossier {
  id: string;
  name: string;
  officialName: string;
  region: string;
  population: string;
  flagEmoji?: string;
  riskScore: number;
  riskChange: number;
  riskLevel: CountryRiskLevel;
  situation: string;
  stats: CountryStatRow[];
  entities: RelatedEntity[];
  timeline: TimelineEvent[];
  financial: FinancialImpact;
  predictions: Prediction[];
  military: MilitaryPosture;
  theaterAssets: MapAsset[];
}
