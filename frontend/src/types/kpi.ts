export interface KPI {
  id: string;
  label: string;
  value: number | string;
  change: number | null;
  changePeriod: string;
  context?: string;
  isPrimary?: boolean;
}

export interface KPISummaryResponse {
  kpis: KPI[];
}
