import { useQuery } from '@tanstack/react-query';
import type { MarketSummaryResponse } from '../types/market';
import { API_BASE_URL } from '../lib/constants';

interface MarketQuote { symbol: string; name: string; price: number; change: number; }
interface CryptoQuote { symbol: string; name: string; price: number; change: number; }
interface CommodityQuote { symbol: string; name: string; price: number; change: number; }
interface SectorPerformance { symbol: string; name: string; change: number; }

export function useMarkets() {
  return useQuery<MarketSummaryResponse>({
    queryKey: ['markets'],
    queryFn: async (): Promise<MarketSummaryResponse> => {
      const [equitiesRes, cryptoRes, commoditiesRes, sectorsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/market/v1/list-market-quotes?symbols=AAPL,NVDA,MSFT,SPY,VIX`)
          .then(r => r.json() as Promise<{ quotes: MarketQuote[] }>),
        fetch(`${API_BASE_URL}/market/v1/list-crypto-quotes?ids=bitcoin,ethereum`)
          .then(r => r.json() as Promise<{ quotes: CryptoQuote[] }>),
        fetch(`${API_BASE_URL}/market/v1/list-commodity-quotes?symbols=XAU,CL`)
          .then(r => r.json() as Promise<{ quotes: CommodityQuote[] }>),
        fetch(`${API_BASE_URL}/market/v1/get-sector-summary`)
          .then(r => r.json() as Promise<{ sectors: SectorPerformance[] }>),
      ]);

      const equities = equitiesRes.status === 'fulfilled' ? equitiesRes.value.quotes ?? [] : [];
      const crypto   = cryptoRes.status === 'fulfilled'   ? cryptoRes.value.quotes ?? []   : [];
      const comms    = commoditiesRes.status === 'fulfilled' ? commoditiesRes.value.quotes ?? [] : [];
      const sectors  = sectorsRes.status === 'fulfilled'  ? sectorsRes.value.sectors ?? []  : [];

      const tickers = [
        ...equities.map(q => ({ ticker: q.symbol, price: q.price, change: q.change, category: 'equity' as const })),
        ...crypto.map(q => ({ ticker: q.symbol.toUpperCase(), price: q.price, change: q.change, category: 'crypto' as const })),
        ...comms.map(q => ({ ticker: q.symbol === 'XAU' ? 'GOLD' : q.symbol === 'CL' ? 'OIL' : q.symbol, price: q.price, change: q.change, category: 'commodity' as const })),
      ];

      const sectorRows = sectors.slice(0, 6).map(s => ({
        name: s.name.replace('Select Sector', '').replace('SPDR Fund', '').trim().split(' ')[0] ?? s.symbol,
        change: s.change,
      }));

      return { tickers, sectors: sectorRows };
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  });
}
