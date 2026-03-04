import { useQuery } from '@tanstack/react-query';
import type { AllMapData } from '../types/map';

// ── Mock data — exact coordinates from WIM prototype ──────────────────────

const ALL_MAP_DATA: AllMapData = {
  carriers: [
    {
      lat: 24.5,
      lng: 58.2,
      name: 'CSG-3 · USS Nimitz (CVN-68)',
      detail:
        'Carrier Air Wing 17 · 5 escorts<br>CG-52 Bunker Hill · DDG-73 Decatur<br>DDG-110 William P. Lawrence · DDG-89 Mustin<br>T-AO-204 Rappahannock',
      status: 'COMBAT READY',
      heading: 310,
    },
    {
      lat: 19.8,
      lng: 62.5,
      name: 'CSG-12 · USS Lincoln (CVN-72)',
      detail:
        'Carrier Air Wing 7 · 4 escorts<br>CG-54 Antietam · DDG-68 The Sullivans<br>DDG-107 Gravely · T-AO-187 Henry J. Kaiser',
      status: 'ON STATION',
      heading: 45,
    },
    {
      lat: 20.2,
      lng: 132.5,
      name: 'CSG-5 · USS Reagan (CVN-76)',
      detail:
        'Carrier Air Wing 5 · Forward deployed<br>CG-67 Shiloh · DDG-85 McCampbell<br>DDG-56 John S. McCain',
      status: 'PATROL · TAIWAN STRAIT',
      heading: 270,
    },
    {
      lat: 34.8,
      lng: 32.5,
      name: 'CSG-8 · USS Truman (CVN-75)',
      detail:
        'Carrier Air Wing 1 · Eastern Med<br>CG-56 San Jacinto · DDG-105 Dewey<br>DDG-81 Winston S. Churchill',
      status: 'STRIKE READY',
      heading: 90,
    },
  ],

  bases: [
    {
      lat: 25.12,
      lng: 51.31,
      name: 'Al Udeid Air Base',
      detail:
        'CENTCOM Forward HQ · Qatar<br>B-52H Stratofortress wing · KC-135 tankers<br>Combined Air Operations Center (CAOC)',
    },
    {
      lat: 29.07,
      lng: 47.52,
      name: 'Ali Al Salem Air Base',
      detail: 'Kuwait · USAF 386th AEW<br>F-15E Strike Eagle · F-16C/D Fighting Falcon',
    },
    {
      lat: 33.78,
      lng: 43.55,
      name: 'Al Asad Air Base',
      detail: 'Iraq · US Marines<br>THAAD battery · MQ-9 Reaper detachment',
    },
    {
      lat: 37.0,
      lng: 35.43,
      name: 'Incirlik Air Base',
      detail:
        'Turkey · USAF 39th ABW<br>F-15E · Nuclear weapons storage<br>~50 B61 tactical nuclear bombs',
    },
    {
      lat: 49.44,
      lng: 7.6,
      name: 'Ramstein Air Base',
      detail: 'Germany · USAFE-AFAFRICA HQ<br>KC-135 tanker ops · C-17 airlift',
    },
    {
      lat: 11.55,
      lng: 43.15,
      name: 'Camp Lemonnier',
      detail: 'Djibouti · CJTF-HOA<br>MQ-9 Reaper ISR · P-8 Poseidon',
    },
    {
      lat: 36.64,
      lng: -6.35,
      name: 'Naval Station Rota',
      detail: 'Spain · NAVSTA Rota<br>DDG-1000 Zumwalt · BMD-capable Aegis destroyers',
    },
    {
      lat: 24.25,
      lng: 54.55,
      name: 'Al Dhafra Air Base',
      detail: 'UAE · F-22 Raptor detachment<br>RQ-4 Global Hawk · KC-10 tankers',
    },
    {
      lat: 21.45,
      lng: 39.17,
      name: 'King Abdulaziz Naval Base',
      detail: 'Saudi Arabia · RSN HQ<br>Joint patrol operations · Patriot battery',
    },
    {
      lat: 32.0,
      lng: 34.87,
      name: 'Palmachim Air Base',
      detail: 'Israel · IAF<br>F-35I Adir · Arrow-3 BMD<br>Jericho III ICBM site',
    },
  ],

  subs: [
    {
      lat: 25.8,
      lng: 56.8,
      name: 'SSN Patrol Area',
      detail:
        '1-2 Virginia-class SSN<br>Hormuz approach · ASW + ISR<br>Tomahawk land-attack capability',
      radius: 60000,
    },
    {
      lat: 33.5,
      lng: 30.5,
      name: 'SSGN Ohio-class',
      detail:
        'USS Ohio (SSGN-726)<br>154 Tomahawk cruise missiles<br>Eastern Mediterranean patrol',
      radius: 45000,
    },
  ],

  aircraft: [
    {
      lat: 40,
      lng: 15,
      name: 'B-2A Spirit × 3',
      detail:
        '509th Bomb Wing · Whiteman AFB<br>En route via Atlantic → Med → Iran corridor<br>GBU-57 MOP (Massive Ordnance Penetrator)<br>Range: 6,000 nmi',
    },
    {
      lat: 26,
      lng: 52,
      name: 'B-52H Stratofortress × 6',
      detail:
        'From Al Udeid · Qatar<br>AGM-158B JASSM-ER armed (575+ nmi range)<br>Standoff strike capability',
    },
    {
      lat: 30,
      lng: 55,
      name: 'RQ-4B Global Hawk',
      detail:
        'ISR orbit · 60,000 ft · 32h endurance<br>SIGINT + EO/IR + SAR radar<br>Full-spectrum persistent surveillance',
    },
    {
      lat: 23,
      lng: 60,
      name: 'P-8A Poseidon × 4',
      detail:
        'VP-5 "Mad Foxes" · from Djibouti & Diego Garcia<br>ASW + Anti-surface warfare<br>Monitoring IRGC naval movements in Gulf',
    },
  ],

  hostile: [
    {
      lat: 35.69,
      lng: 51.39,
      name: 'IRGC HQ · Tehran',
      detail:
        'Supreme National Security Council<br>Command & control node · STRUCK in wave 1<br>Status: Partially destroyed',
      status: 'STRUCK',
    },
    {
      lat: 27.19,
      lng: 56.27,
      name: 'IRGC Navy · Bandar Abbas',
      detail:
        'IRGC Naval Forces HQ<br>8 fast attack craft deployed<br>Mines staged for Hormuz deployment',
      status: 'ACTIVE THREAT',
    },
    {
      lat: 32.38,
      lng: 48.4,
      name: 'Dezful Missile Base',
      detail:
        'IRGC Aerospace Force<br>Shahab-3 TEL activity detected<br>3 mobile launchers repositioned in 4h',
      status: 'TEL ACTIVE',
    },
    {
      lat: 33.49,
      lng: 48.05,
      name: 'Kermanshah Missile Base',
      detail:
        'IRGC missile garrison<br>Emad MRBM launchers<br>Strike capability: Israel, Gulf states',
      status: 'ELEVATED',
    },
    {
      lat: 27.75,
      lng: 52.59,
      name: 'Bushehr Nuclear Plant',
      detail:
        '1000 MW reactor · Russian-built<br>Strike damage to support facilities<br>Active fires in adjacent area',
      status: 'DAMAGED',
    },
    {
      lat: 36.85,
      lng: 54.35,
      name: 'Semnan Space Center',
      detail:
        'IRGC missile test facility<br>Used for satellite launches<br>Ballistic missile R&D dual-use',
      status: 'MONITORING',
    },
  ],

  nuclear: [
    {
      lat: 33.72,
      lng: 51.72,
      name: 'Natanz (FEP)',
      detail:
        'Fuel Enrichment Plant<br>Main uranium enrichment facility<br>IR-6 centrifuges · Up to 60% HEU<br>Strike damage assessment: PENDING',
    },
    {
      lat: 34.88,
      lng: 51.98,
      name: 'Fordow (FFEP)',
      detail:
        'Underground enrichment facility<br>Built into mountain · 80m depth<br>~1,000 centrifuges · Near weapons grade<br>Likely survived strikes due to hardening',
    },
    {
      lat: 32.5,
      lng: 51.67,
      name: 'Isfahan UCF',
      detail:
        'Uranium Conversion Facility<br>Converts yellowcake to UF6 feedstock<br>STRUCK — secondary fires reported',
    },
    {
      lat: 34.37,
      lng: 49.24,
      name: 'Arak IR-40',
      detail:
        'Heavy water reactor (redesigned)<br>Plutonium production potential<br>Status post-strike: UNKNOWN',
    },
  ],

  proxies: [
    {
      lat: 15.35,
      lng: 44.2,
      name: 'Houthi SSM Sites · Yemen',
      detail:
        'Anti-ship missile capability<br>C-802 / Noor missiles · Red Sea threat<br>Multiple launch sites in Hodeidah & Sanaa',
    },
    {
      lat: 33.85,
      lng: 35.86,
      name: 'Hezbollah · Southern Lebanon',
      detail:
        'Est. 150,000+ rockets & missiles<br>Zelzal, Fateh-110, precision-guided munitions<br>Range covers all of Israel<br>~40,000 active fighters',
    },
    {
      lat: 33.33,
      lng: 44.37,
      name: "PMF / Kata'ib Hezbollah · Iraq",
      detail:
        'Iran-aligned Popular Mobilization Forces<br>Rocket & drone attack capability<br>Targeting US bases in Iraq & Syria',
    },
    {
      lat: 34.8,
      lng: 36.72,
      name: 'IRGC advisors · Syria',
      detail:
        'Quds Force presence<br>T4 Air Base · Missile storage<br>Coordinates with Hezbollah & SAA',
    },
    {
      lat: 31.52,
      lng: 34.47,
      name: 'Hamas · Gaza',
      detail:
        'Rocket capability degraded post-2024<br>Still maintains tunnel network<br>Limited offensive capacity',
    },
  ],

  routes: [
    {
      pts: [
        [26.5, 56.5], [25.5, 57.0], [24.5, 58.0], [22.0, 60.0], [18.0, 62.0],
        [12.0, 52.0], [8.0, 48.0], [2.0, 43.0], [-5.0, 40.0],
      ],
      col: '#00D878',
      label: 'Tanker: Gulf → Indian Ocean',
    },
    {
      pts: [
        [26.5, 56.5], [24.0, 57.5], [20.0, 62.0], [12.0, 65.0], [5.0, 62.0],
        [-8.0, 55.0], [-20.0, 40.0], [-35.0, 20.0], [-34.0, 18.0], [5.0, 0.0], [36.0, -8.0],
      ],
      col: '#FF9000',
      label: 'Rerouted: Cape of Good Hope (avoid Hormuz)',
      dash: '8 6',
    },
    {
      pts: [
        [12.3, 43.5], [13.0, 43.2], [14.5, 42.0], [20.0, 40.0],
        [27.0, 35.0], [30.0, 32.5], [31.0, 32.0],
      ],
      col: '#FF6020',
      label: 'Red Sea (Houthi-contested)',
    },
    {
      pts: [
        [26.5, 56.5], [22.0, 62.0], [15.0, 68.0], [10.0, 76.0],
        [5.0, 85.0], [2.0, 100.0], [1.5, 104.0],
      ],
      col: '#F5A020',
      label: 'China oil supply: Hormuz → Malacca',
    },
  ],

  chokepoints: [
    {
      lat: 26.6,
      lng: 56.2,
      name: 'Strait of Hormuz',
      detail:
        '20% of global oil supply<br>23 ships currently transiting<br>4 tankers turned around<br>War risk insurance +300%',
      status: 'CRITICAL',
      col: '#FF2040',
    },
    {
      lat: 30.5,
      lng: 32.3,
      name: 'Suez Canal',
      detail:
        '12% of world trade<br>47 ships in transit<br>Elevated security screening<br>4-6h delay backlog',
      status: 'ELEVATED',
      col: '#FF6020',
    },
    {
      lat: 12.6,
      lng: 43.3,
      name: 'Bab el-Mandeb',
      detail:
        '9% of oil trade<br>Houthi anti-ship missile range<br>12 ships transiting<br>USN escort required',
      status: 'HIGH RISK',
      col: '#FF6020',
    },
    {
      lat: 35.96,
      lng: -5.5,
      name: 'Strait of Gibraltar',
      detail:
        'Atlantic ↔ Mediterranean gateway<br>62 ships transiting<br>Normal operations',
      status: 'NORMAL',
      col: '#4E6480',
    },
    {
      lat: 1.35,
      lng: 103.82,
      name: 'Strait of Malacca',
      detail:
        '25% of world trade<br>84 ships transiting<br>Monitoring for disruption spillover',
      status: 'NORMAL',
      col: '#4E6480',
    },
  ],

  missileRanges: [
    { radius: 1300000, label: 'Shahab-3 · 1,300 km' },
    { radius: 1700000, label: 'Emad · 1,700 km' },
    { radius: 2000000, label: 'Khorramshahr · 2,000 km' },
  ],

  airspaceZones: [
    {
      polygon: [
        [39.8, 44.0], [39.8, 63.3], [25.0, 63.3], [25.0, 44.0],
      ],
      color: '#FF2040',
      weight: 1.5,
      opacity: 0.3,
      fillOpacity: 0.04,
      title: 'IRAN AIRSPACE — CLOSED',
      detail: 'All civil aviation suspended<br>47 commercial flights rerouted<br>Military activity only',
    },
    {
      polygon: [
        [37.0, 40.0], [37.0, 48.0], [29.5, 48.0], [29.5, 40.0],
      ],
      color: '#FF6020',
      weight: 1,
      opacity: 0.2,
      fillOpacity: 0.02,
      title: 'IRAQ AIRSPACE — RESTRICTED',
      detail: 'Restricted above FL250<br>Military operations in progress',
    },
  ],
};

// ── Hook ──────────────────────────────────────────────────────────────────

import { API_BASE_URL } from '../lib/constants';

interface TheaterPosture {
  theater: string;
  postureLevel: string;
  activeFlights: number;
  trackedVessels: number;
  activeOperations: string[];
}

export function useMapAssets() {
  return useQuery<AllMapData>({
    queryKey: ['map-assets'],
    queryFn: async (): Promise<AllMapData> => {
      // Fetch live theater posture to update vessels tracked count
      // Base static data (carrier positions, bases, etc.) is authoritative
      // and gets overlaid with live flight/vessel counts from the API
      try {
        const res = await fetch(`${API_BASE_URL}/military/v1/get-theater-posture`);
        const data: { theaters: TheaterPosture[] } = await res.json();
        const theaters = data.theaters ?? [];

        // Merge live vessel counts into chokepoints as a live annotation
        const updatedChokepoints = ALL_MAP_DATA.chokepoints.map(cp => {
          if (cp.name.includes('Hormuz')) {
            const gulf = theaters.find(t => t.theater === 'PERSIAN_GULF' || t.theater === 'gulf');
            if (gulf) {
              return {
                ...cp,
                detail: cp.detail.replace(/\d+ ships currently transiting/, `${gulf.trackedVessels} vessels tracked live`),
              };
            }
          }
          return cp;
        });

        return { ...ALL_MAP_DATA, chokepoints: updatedChokepoints };
      } catch {
        return ALL_MAP_DATA;
      }
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
