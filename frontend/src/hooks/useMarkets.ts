import { useQuery } from '@tanstack/react-query';
import type { MarketSummaryResponse } from '../types/market';
import { API_BASE_URL } from '../lib/constants';

interface MarketQuote { symbol: string; name: string; price: number | null | undefined; change: number | null | undefined; }
interface CryptoQuote { symbol: string; name: string; price: number | null | undefined; change: number | null | undefined; }
interface CommodityQuote { symbol: string; name: string; price: number | null | undefined; change: number | null | undefined; }
interface SectorPerformance { symbol: string; name: string; change: number | null | undefined; }

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
        ...equities
          .filter(q => q.price != null && q.change != null)
          .map(q => ({ ticker: q.symbol, price: q.price as number, change: q.change as number, category: 'equity' as const })),
        ...crypto
          .filter(q => q.price != null && q.change != null)
          .map(q => ({ ticker: q.symbol.toUpperCase(), price: q.price as number, change: q.change as number, category: 'crypto' as const })),
        ...comms
          .filter(q => q.price != null && q.change != null)
          .map(q => ({ ticker: q.symbol === 'XAU' ? 'GOLD' : q.symbol === 'CL' ? 'OIL' : q.symbol, price: q.price as number, change: q.change as number, category: 'commodity' as const })),
      ];

      const sectorRows = sectors
        .filter(s => s.change != null)
        .slice(0, 6)
        .map(s => ({
          name: s.name.replace('Select Sector', '').replace('SPDR Fund', '').trim().split(' ')[0] ?? s.symbol,
          change: s.change as number,
        }));

      return { tickers, sectors: sectorRows };
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
    refetchInterval: 5 * 60 * 1000,
  });
}
