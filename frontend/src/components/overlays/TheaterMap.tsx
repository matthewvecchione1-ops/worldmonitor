import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

// ── Country center coordinates ───────────────────────────────────────────────

const COUNTRY_COORDS: Record<string, { center: [number, number]; zoom: number }> = {
  US: { center: [38.0, -97.0],   zoom: 4 },
  RU: { center: [62.0, 100.0],  zoom: 3 },
  CN: { center: [35.0, 105.0],  zoom: 4 },
  UA: { center: [49.0,  32.0],  zoom: 6 },
  IR: { center: [32.5,  53.5],  zoom: 5 },
  IL: { center: [31.5,  35.0],  zoom: 7 },
  TW: { center: [23.5, 121.0],  zoom: 7 },
  KP: { center: [40.0, 127.0],  zoom: 6 },
  SA: { center: [24.0,  45.0],  zoom: 5 },
  TR: { center: [39.0,  35.0],  zoom: 5 },
  PL: { center: [52.0,  20.0],  zoom: 6 },
  DE: { center: [51.0,  10.0],  zoom: 6 },
  FR: { center: [47.0,   2.0],  zoom: 5 },
  GB: { center: [54.0,  -2.0],  zoom: 5 },
  IN: { center: [20.0,  78.0],  zoom: 4 },
  PK: { center: [30.0,  70.0],  zoom: 5 },
  SY: { center: [35.0,  38.0],  zoom: 6 },
  YE: { center: [15.5,  48.0],  zoom: 6 },
  MM: { center: [17.0,  96.0],  zoom: 5 },
  VE: { center: [ 8.0, -66.0],  zoom: 5 },
};

// ── Map resizer (fixes Leaflet size after container resize) ──────────────────

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

// ── TheaterMap ───────────────────────────────────────────────────────────────

export default function TheaterMap({ countryCode }: { countryCode: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const lookup = COUNTRY_COORDS[countryCode.toUpperCase()];
  const center: [number, number] = lookup?.center ?? [20, 0];
  const zoom = lookup?.zoom ?? 3;

  return (
    <div ref={containerRef} style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
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
      </MapContainer>
    </div>
  );
}
