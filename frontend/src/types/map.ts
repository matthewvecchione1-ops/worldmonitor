// ── Legacy flat asset type (used by CountryDossier.theaterAssets) ─────────

export type MapAssetType =
  | 'carrier'
  | 'base'
  | 'submarine'
  | 'aircraft'
  | 'hostile'
  | 'nuclear'
  | 'proxy'
  | 'chokepoint';

export interface MapAsset {
  id: string;
  lat: number;
  lng: number;
  type: MapAssetType;
  name: string;
  detail: string;
  status: string;
  statusColor: string;
  heading?: number;
  range?: number;
  lastUpdated?: string;
}

// ── Per-layer asset interfaces ──────────────────────────────────────────────

export interface CarrierAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
  status: string;
  heading?: number;
}

export interface BaseAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
}

export interface SubAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
  radius: number;
}

export interface AircraftAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
}

export interface HostileAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
  status: string;
}

export interface NuclearAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
}

export interface ProxyAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
}

export interface RouteData {
  pts: [number, number][];
  col: string;
  label: string;
  dash?: string;
}

export interface ChokepointAsset {
  lat: number;
  lng: number;
  name: string;
  detail: string;
  status: string;
  col: string;
}

export interface MissileRangeData {
  radius: number;
  label: string;
}

export interface AirspaceZoneData {
  polygon: [number, number][];
  color: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
  title: string;
  detail: string;
}

// ── Combined response type ──────────────────────────────────────────────────

export interface AllMapData {
  carriers: CarrierAsset[];
  bases: BaseAsset[];
  subs: SubAsset[];
  aircraft: AircraftAsset[];
  hostile: HostileAsset[];
  nuclear: NuclearAsset[];
  proxies: ProxyAsset[];
  routes: RouteData[];
  chokepoints: ChokepointAsset[];
  missileRanges: MissileRangeData[];
  airspaceZones: AirspaceZoneData[];
}

// ── Layer type (drives useMapStore) ────────────────────────────────────────

export type MapLayerType =
  | 'carriers'
  | 'bases'
  | 'submarines'
  | 'aircraft'
  | 'hostile'
  | 'proxy'
  | 'nuclear'
  | 'routes'
  | 'missiles'
  | 'airspace'
  | 'chokepoints';
