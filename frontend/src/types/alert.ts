export interface HeroAlert {
  id: string;
  severity: 'critical' | 'high';
  headline: string;
  probability: number;
  probabilityLabel: string;
  countryId: string;
  timestamp: string;
  dismissed: boolean;
}
