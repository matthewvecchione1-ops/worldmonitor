import { useQuery } from '@tanstack/react-query';
import type { AllMapData } from '../types/map';
import { API_BASE_URL } from '../lib/constants';

// ── Static map layer data ─────────────────────────────────────────────────
//
// Only permanent, publicly documented installations and geographic features.
// No real-time military positions, no operational status, no scenario-specific data.

const STATIC_MAP_DATA: AllMapData = {
  // No real-time carrier tracking — positions are not publicly verified
  carriers: [],

  // Major military installations — permanent, publicly documented locations
  bases: [
    {
      lat: 25.12,
      lng: 51.31,
      name: 'Al Udeid Air Base',
      detail: 'CENTCOM Forward HQ · Qatar<br>Major US Air Force installation in the Gulf',
    },
    {
      lat: 29.07,
      lng: 47.52,
      name: 'Ali Al Salem Air Base',
      detail: 'Kuwait · USAF installation',
    },
    {
      lat: 33.78,
      lng: 43.55,
      name: 'Al Asad Air Base',
      detail: 'Anbar Province, Iraq · Coalition air base',
    },
    {
      lat: 37.0,
      lng: 35.43,
      name: 'Incirlik Air Base',
      detail: 'Adana, Turkey · USAF 39th Air Base Wing',
    },
    {
      lat: 49.44,
      lng: 7.6,
      name: 'Ramstein Air Base',
      detail: 'Rhineland-Palatinate, Germany · USAFE-AFAFRICA HQ',
    },
    {
      lat: 11.55,
      lng: 43.15,
      name: 'Camp Lemonnier',
      detail: 'Djibouti · CJTF-HOA — US Horn of Africa base',
    },
    {
      lat: 36.64,
      lng: -6.35,
      name: 'Naval Station Rota',
      detail: 'Cádiz, Spain · US Naval Station',
    },
    {
      lat: 24.25,
      lng: 54.55,
      name: 'Al Dhafra Air Base',
      detail: 'Abu Dhabi, UAE · USAF installation',
    },
    {
      lat: 21.45,
      lng: 39.17,
      name: 'King Abdulaziz Naval Base',
      detail: 'Jeddah, Saudi Arabia · Royal Saudi Naval Forces HQ',
    },
    {
      lat: 32.0,
      lng: 34.87,
      name: 'Palmachim Air Base',
      detail: 'Israel · Israeli Air Force base',
    },
  ],

  // No real-time submarine position data
  subs: [],

  // No real-time aircraft position data
  aircraft: [],

  // No verified real-time hostile force positions
  hostile: [],

  // No verified real-time nuclear site status
  nuclear: [],

  // No verified real-time proxy force positions
  proxies: [],

  // Major global shipping lanes — permanent geographic features
  routes: [
    {
      pts: [
        [26.5, 56.5], [25.5, 57.0], [24.5, 58.0], [22.0, 60.0], [18.0, 62.0],
        [12.0, 52.0], [8.0, 48.0], [2.0, 43.0], [-5.0, 40.0],
      ],
      col: '#00D878',
      label: 'Persian Gulf → Indian Ocean',
    },
    {
      pts: [
        [12.3, 43.5], [13.0, 43.2], [14.5, 42.0], [20.0, 40.0],
        [27.0, 35.0], [30.0, 32.5], [31.0, 32.0],
      ],
      col: '#4E8FD0',
      label: 'Red Sea — Bab el-Mandeb',
    },
    {
      pts: [
        [26.5, 56.5], [22.0, 62.0], [15.0, 68.0], [10.0, 76.0],
        [5.0, 85.0], [2.0, 100.0], [1.5, 104.0],
      ],
      col: '#F5A020',
      label: 'Indian Ocean — Malacca Strait',
    },
  ],

  // Strategic chokepoints — populated from live API, fallback to reference data
  chokepoints: [
    {
      lat: 26.6,
      lng: 56.2,
      name: 'Strait of Hormuz',
      detail: '~20% of global oil supply transits<br>Key Persian Gulf choke point',
      status: 'MONITORING',
      col: '#F5A020',
    },
    {
      lat: 30.5,
      lng: 32.3,
      name: 'Suez Canal',
      detail: '~12% of world trade transits<br>Mediterranean ↔ Red Sea connector',
      status: 'MONITORING',
      col: '#4E6480',
    },
    {
      lat: 12.6,
      lng: 43.3,
      name: 'Bab el-Mandeb',
      detail: '~9% of oil trade transits<br>Red Sea ↔ Gulf of Aden connector',
      status: 'MONITORING',
      col: '#4E6480',
    },
    {
      lat: 35.96,
      lng: -5.5,
      name: 'Strait of Gibraltar',
      detail: 'Atlantic ↔ Mediterranean gateway',
      status: 'NORMAL',
      col: '#4E6480',
    },
    {
      lat: 1.35,
      lng: 103.82,
      name: 'Strait of Malacca',
      detail: '~25% of world trade transits<br>Pacific ↔ Indian Ocean connector',
      status: 'NORMAL',
      col: '#4E6480',
    },
  ],

  // No scenario-specific missile range overlays
  missileRanges: [],

  // No scenario-specific airspace zone overlays
  airspaceZones: [],
};

// ── Hook ──────────────────────────────────────────────────────────────────

interface TheaterPosture {
  theater: string;
  postureLevel: string;
  activeFlights: number;
  trackedVessels: number;
  activeOperations: string[];
}

interface ChokepointStatus {
  name: string;
  status?: string;
  disruptionScore?: number;
  congestionLevel?: number;
  activeWarnings?: number;
  description?: string;
  lat?: number;
  lon?: number;
}

interface ChokepointApiResponse {
  chokepoints?: ChokepointStatus[];
}

export function useMapAssets() {
  return useQuery<AllMapData>({
    queryKey: ['map-assets'],
    queryFn: async (): Promise<AllMapData> => {
      try {
        const [theaterRes, chopRes] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/military/v1/get-theater-posture`).then(r => r.json() as Promise<{ theaters: TheaterPosture[] }>),
          fetch(`${API_BASE_URL}/supply-chain/v1/get-chokepoint-status`).then(r => r.json() as Promise<ChokepointApiResponse>),
        ]);

        const theaters = theaterRes.status === 'fulfilled' ? (theaterRes.value.theaters ?? []) : [];
        const liveChokepoints = chopRes.status === 'fulfilled' ? (chopRes.value.chokepoints ?? []) : [];

        // Merge live chokepoint data with static reference points
        const updatedChokepoints = STATIC_MAP_DATA.chokepoints.map(cp => {
          const live = liveChokepoints.find(l =>
            l.name?.toLowerCase().includes(cp.name.toLowerCase().split(' ')[0]!)
          );
          if (live) {
            const score = live.disruptionScore ?? 0;
            const statusColor = score >= 75 ? '#FF2040' : score >= 50 ? '#FF6020' : score >= 25 ? '#F5A020' : '#4E6480';
            const statusLabel = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH RISK' : score >= 25 ? 'ELEVATED' : 'NORMAL';
            const warnings = live.activeWarnings ? ` · ${live.activeWarnings} active warning${live.activeWarnings !== 1 ? 's' : ''}` : '';
            return {
              ...cp,
              status: statusLabel,
              col: statusColor,
              detail: cp.detail + (score > 0 ? `<br>Disruption index: ${score}%${warnings}` : ''),
            };
          }
          // Annotate Hormuz with vessel count from theater posture
          if (cp.name.includes('Hormuz')) {
            const gulf = theaters.find(t => t.theater === 'PERSIAN_GULF' || t.theater === 'gulf');
            if (gulf?.trackedVessels) {
              return {
                ...cp,
                detail: cp.detail + `<br>${gulf.trackedVessels} vessels tracked`,
              };
            }
          }
          return cp;
        });

        return { ...STATIC_MAP_DATA, chokepoints: updatedChokepoints };
      } catch {
        return STATIC_MAP_DATA;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
