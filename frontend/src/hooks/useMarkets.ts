import { useQuery } from '@tanstack/react-query';
import type { MarketSummaryResponse } from '../types/market';

// ── Mock data — WIM prototype Markets ────────────────────────────────────

const MOCK_MARKETS: MarketSummaryResponse = {
  tickers: [
    { ticker: 'AAPL', price:   264.18, change: -3.21, category: 'equity'    },
    { ticker: 'NVDA', price:   177.19, change: -4.16, category: 'equity'    },
    { ticker: 'MSFT', price:   392.74, change: -2.24, category: 'equity'    },
    { ticker: 'BTC',  price: 66963.00, change:  5.41, category: 'crypto'    },
    { ticker: 'GOLD', price:  5248.00, change:  1.03, category: 'commodity' },
    { ticker: 'OIL',  price:    67.02, change:  2.78, category: 'commodity' },
    { ticker: 'VIX',  price:    19.86, change:  6.60, category: 'index'     },
    { ticker: 'ETH',  price:  1999.00, change:  7.95, category: 'crypto'    },
  ],
  sectors: [
    { name: 'Tech',   change: -1.6 },
    { name: 'Fin',    change: -2.0 },
    { name: 'Energy', change:  1.6 },
    { name: 'Health', change:  1.8 },
    { name: 'Cons',   change: -0.2 },
    { name: 'Utils',  change:  1.1 },
  ],
};

// ── Hook ──────────────────────────────────────────────────────────────────

export function useMarkets() {
  return useQuery<MarketSummaryResponse>({
    queryKey: ['markets'],
    queryFn: async () => MOCK_MARKETS,
    staleTime: Infinity,
  });
}
