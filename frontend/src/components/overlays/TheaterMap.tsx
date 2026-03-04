import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Theater data (Iran — hardcoded for prototype) ───────────────────────────

const STRIKE_SITES = [
  {
    lat: 35.69, lng: 51.39,
    name: 'Tehran · IRGC HQ',
    detail: 'Wave 1 target · Command center<br>Partially destroyed · Fires reported',
    status: 'STRUCK',
  },
  {
    lat: 32.65, lng: 51.68,
    name: 'Isfahan · Military Complex',
    detail: '12 targets struck · Secondary explosions<br>SAM network degraded',
    status: 'STRUCK',
  },
  {
    lat: 27.75, lng: 52.59,
    name: 'Bushehr · Nuclear Plant',
    detail: 'Support facilities hit · Reactor status pending<br>Fires at adjacent refinery',
    status: 'STRUCK / FIRE',
  },
  {
    lat: 35.69, lng: 51.25,
    name: 'Tehran · Aerospace Industries Org',
    detail: 'Missile production facility struck<br>Significant structural damage',
    status: 'STRUCK',
  },
  {
    lat: 33.49, lng: 48.05,
    name: 'Kermanshah · IRGC Garrison',
    detail: 'Garrison and logistics hub struck<br>TEL sites targeted',
    status: 'STRUCK',
  },
] as const;

const THEATER_NUCLEAR = [
  { lat: 33.72, lng: 51.72, name: 'Natanz (FEP)',   detail: 'Fuel Enrichment Plant · Strike damage pending assessment' },
  { lat: 34.88, lng: 51.98, name: 'Fordow (FFEP)',  detail: 'Underground · Likely survived penetrating strikes' },
  { lat: 32.50, lng: 51.67, name: 'Isfahan UCF',    detail: 'Uranium Conversion Facility · STRUCK — fires reported' },
  { lat: 34.37, lng: 49.24, name: 'Arak IR-40',     detail: 'Heavy-water reactor · Damage assessment ongoing' },
] as const;

const THEATER_BASES = [
  { lat: 32.38, lng: 48.40, name: 'Dezful Missile Base',       detail: 'Ballistic missile storage · TEL activity detected' },
  { lat: 36.23, lng: 59.60, name: 'Mashhad Air Base',          detail: 'Primary IRIAF base · F-14 / Su-24 assets' },
  { lat: 35.35, lng: 51.67, name: 'Doshan Tappeh AB (Tehran)', detail: 'Air defense node · Radar disrupted' },
  { lat: 27.19, lng: 56.27, name: 'Bandar Abbas Naval Base',   detail: 'IRGC Navy HQ · Fast-boat swarms deployed' },
] as const;

const THEATER_OIL = [
  { lat: 32.62, lng: 51.66, name: 'Isfahan Refinery',          isFire: true,  detail: 'Active fire · ~40% capacity offline' },
  { lat: 28.92, lng: 50.83, name: 'Kharg Island Oil Terminal', isFire: false, detail: 'Largest export terminal · Status: operational' },
  { lat: 27.85, lng: 52.28, name: 'Bushehr Refinery',          isFire: true,  detail: 'Fire reported · Adjacent to nuclear plant' },
  { lat: 30.43, lng: 49.00, name: 'Abadan Refinery',           isFire: false, detail: 'Elevated alert · No damage reported' },
] as const;

const DISPLACEMENT_FLOWS: Array<{ from: [number, number]; to: [number, number]; label: string; count: string }> = [
  { from: [35.69, 51.39], to: [36.27, 59.60], label: 'Tehran → Mashhad', count: '~120,000' },
  { from: [35.69, 51.39], to: [38.07, 46.30], label: 'Tehran → Tabriz',  count: '~80,000'  },
  { from: [32.65, 51.68], to: [38.07, 46.30], label: 'Isfahan → Tabriz', count: '~40,000'  },
];

const HORMUZ_LINE: [number, number][] = [
  [26.6, 56.0], [26.4, 56.4], [26.5, 56.8], [26.8, 57.0],
];

const US_FORCES = [
  { lat: 24.5,  lng: 58.2,  name: 'CSG-3 (Nimitz)',  detail: 'Carrier Strike Group 3 · Gulf of Oman' },
  { lat: 25.12, lng: 51.31, name: 'Al Udeid AB',      detail: 'USAF · Qatar · B-52, F-15E assets'   },
] as const;

// ── Icon helpers ────────────────────────────────────────────────────────────

function makeDotIcon(color: string, size = 10, pulse = false): L.DivIcon {
  const ring = pulse
    ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.45;animation:leafPulse 1.8s ease-out infinite;pointer-events:none"></div>`
    : '';
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px">
      ${ring}
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:1.5px solid rgba(255,255,255,0.22);box-shadow:0 0 7px ${color}99"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  });
}

function makeSquareIcon(color: string, size = 8): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:1.5px solid rgba(255,255,255,0.28);box-shadow:0 0 6px ${color}99;transform:rotate(45deg)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 6)],
  });
}

// ── Map resizer ─────────────────────────────────────────────────────────────

function MapResizer({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const map = useMap();
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => { map.invalidateSize(); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [map, containerRef]);
  return null;
}

// ── Popup content helper ────────────────────────────────────────────────────

function PopupContent({ label, labelColor, name, detail, html = false }: {
  label: string; labelColor: string; name: string; detail: string; html?: boolean;
}) {
  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif", minWidth: 170 }}>
      <div style={{ color: labelColor, fontWeight: 700, fontSize: 11, marginBottom: 3, letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ color: '#ECF0F8', fontWeight: 700, fontSize: 12, marginBottom: 5 }}>{name}</div>
      {html
        ? <div style={{ color: '#8CA0BC', fontSize: 10, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: detail }} />
        : <div style={{ color: '#8CA0BC', fontSize: 10, lineHeight: 1.5 }}>{detail}</div>
      }
    </div>
  );
}

// ── TheaterMap ──────────────────────────────────────────────────────────────

export default function TheaterMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  const strikeIcon  = makeDotIcon('#FF2040', 10, true);
  const nuclearIcon = makeDotIcon('#FFD000', 9);
  const baseIcon    = makeDotIcon('#1A8FFF', 8);
  const oilIcon     = makeDotIcon('#FF6020', 8);
  const fireIcon    = makeDotIcon('#FF6020', 10, true);
  const usIcon      = makeSquareIcon('#1A8FFF', 9);

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[32.5, 53.5]}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#05080F' }}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom
      >
        <MapResizer containerRef={containerRef as React.RefObject<HTMLDivElement>} />

        {/* Dark base tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={18}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={18}
          pane="shadowPane"
        />

        {/* Missile range rings centred on central Iran */}
        <Circle
          center={[32.5, 53]}
          radius={500000}
          pathOptions={{ color: '#FF2040', weight: 1, dashArray: '4 4', fillOpacity: 0.02, opacity: 0.45 }}
        />
        <Circle
          center={[32.5, 53]}
          radius={1300000}
          pathOptions={{ color: '#FF6020', weight: 1, dashArray: '6 6', fillOpacity: 0.01, opacity: 0.3 }}
        />

        {/* Strait of Hormuz chokepoint */}
        <Polyline
          positions={HORMUZ_LINE}
          pathOptions={{ color: '#FFD000', weight: 2, dashArray: '3 4', opacity: 0.65 }}
        />

        {/* Displacement flows */}
        {DISPLACEMENT_FLOWS.map((flow, i) => (
          <Polyline
            key={`disp-${i}`}
            positions={[flow.from, flow.to]}
            pathOptions={{ color: '#FF6020', weight: 1.5, dashArray: '5 7', opacity: 0.4 }}
          />
        ))}

        {/* Strike sites */}
        {STRIKE_SITES.map((site, i) => (
          <Marker key={`strike-${i}`} position={[site.lat, site.lng]} icon={strikeIcon}>
            <Popup>
              <PopupContent label={`✦ ${site.status}`} labelColor="#FF2040" name={site.name} detail={site.detail} html />
            </Popup>
          </Marker>
        ))}

        {/* Nuclear sites */}
        {THEATER_NUCLEAR.map((site, i) => (
          <Marker key={`nuc-${i}`} position={[site.lat, site.lng]} icon={nuclearIcon}>
            <Popup>
              <PopupContent label="☢ NUCLEAR" labelColor="#FFD000" name={site.name} detail={site.detail} />
            </Popup>
          </Marker>
        ))}

        {/* Military bases */}
        {THEATER_BASES.map((site, i) => (
          <Marker key={`base-${i}`} position={[site.lat, site.lng]} icon={baseIcon}>
            <Popup>
              <PopupContent label="⚔ MILITARY" labelColor="#1A8FFF" name={site.name} detail={site.detail} />
            </Popup>
          </Marker>
        ))}

        {/* Oil / energy infrastructure */}
        {THEATER_OIL.map((site, i) => (
          <Marker key={`oil-${i}`} position={[site.lat, site.lng]} icon={site.isFire ? fireIcon : oilIcon}>
            <Popup>
              <PopupContent label={site.isFire ? '🔥 FIRE' : '⛽ ENERGY'} labelColor="#FF6020" name={site.name} detail={site.detail} />
            </Popup>
          </Marker>
        ))}

        {/* US forces */}
        {US_FORCES.map((site, i) => (
          <Marker key={`us-${i}`} position={[site.lat, site.lng]} icon={usIcon}>
            <Popup>
              <PopupContent label="🇺🇸 US FORCES" labelColor="#1A8FFF" name={site.name} detail={site.detail} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
