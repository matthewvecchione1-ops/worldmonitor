export type MarketCategory = 'equity' | 'commodity' | 'crypto' | 'index';

export interface MarketTick {
  ticker: string;
  price: number;
  change: number;
  category: MarketCategory;
}

export interface SectorPerf {
  name: string;
  change: number;
}

export interface MarketSummaryResponse {
  tickers: MarketTick[];
  sectors: SectorPerf[];
}
