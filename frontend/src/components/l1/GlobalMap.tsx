import { useRef, useEffect, Fragment } from 'react';
import type { RefObject } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  Polygon,
  useMap,
} from 'react-leaflet';
import { useMapStore } from '../../stores/useMapStore';
import { useFocusStore } from '../../stores/useFocusStore';
import { useMapAssets } from '../../hooks/useMapAssets';
import {
  createPulseIcon,
  createDotIcon,
  createDiamondIcon,
  createTriangleIcon,
  createSquareIcon,
  createPopupHTML,
} from '../../lib/mapHelpers';
import MapLayerPanel from './MapLayerPanel';

// ── Internal: invalidate map size when container resizes ──────────────────

function MapResizer({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const map = useMap();
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [map, containerRef]);
  return null;
}

// ── Main component ────────────────────────────────────────────────────────

export default function GlobalMap() {
  const { layers } = useMapStore();
  const openCountryFocus = useFocusStore((s) => s.openCountryFocus);
  const { data } = useMapAssets();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0"
      style={{
        height: '48vh',
        minHeight: 260,
        maxHeight: 440,
        borderTop: '1px solid #1C2C42',
        borderBottom: '1px solid #1C2C42',
      }}
    >
      <MapContainer
        center={[28, 48]}
        zoom={3}
        minZoom={2}
        maxZoom={14}
        worldCopyJump
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapResizer containerRef={containerRef} />

        {/* ── Tile layers ── */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
          pane="shadowPane"
        />

        {/* ── Invisible Iran click region ── */}
        <Circle
          center={[32.5, 53]}
          radius={500000}
          pathOptions={{
            color: 'transparent',
            fillColor: 'transparent',
            fillOpacity: 0,
            stroke: false,
          }}
          eventHandlers={{ click: () => openCountryFocus('iran') }}
        />

        {/* ── CARRIERS (pulse #00AAFF sz=16 outer=30) ── */}
        {layers.carriers &&
          data?.carriers.map((c, i) => (
            <Marker
              key={`carrier-${i}`}
              position={[c.lat, c.lng]}
              icon={createPulseIcon('#00AAFF', 16, 30)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('⚓ ' + c.name, c.detail, c.status, '#00AAFF'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── BASES (square #55CCFF sz=8 outer=14) ── */}
        {layers.bases &&
          data?.bases.map((b, i) => (
            <Marker
              key={`base-${i}`}
              position={[b.lat, b.lng]}
              icon={createSquareIcon('#55CCFF', 8)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('🏛 ' + b.name, b.detail, 'ACTIVE', '#55CCFF'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── SUBMARINES (dashed circle + dot #1A8FFF) ── */}
        {layers.submarines &&
          data?.subs.map((s, i) => (
            <Fragment key={`sub-${i}`}>
              <Circle
                center={[s.lat, s.lng]}
                radius={s.radius}
                pathOptions={{
                  color: '#1A8FFF',
                  weight: 1,
                  opacity: 0.25,
                  fillColor: '#1A8FFF',
                  fillOpacity: 0.03,
                  dashArray: '4 6',
                }}
              />
              <Marker
                position={[s.lat, s.lng]}
                icon={createDotIcon('#1A8FFF', 8)}
              >
                <Popup maxWidth={280}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: createPopupHTML('🔵 ' + s.name, s.detail, 'SUBMERGED', '#1A8FFF'),
                    }}
                  />
                </Popup>
              </Marker>
            </Fragment>
          ))}

        {/* ── AIRCRAFT (triangle #CC44FF sz=10 outer=16) ── */}
        {layers.aircraft &&
          data?.aircraft.map((a, i) => (
            <Marker
              key={`aircraft-${i}`}
              position={[a.lat, a.lng]}
              icon={createTriangleIcon('#CC44FF', 10)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('✈ ' + a.name, a.detail, 'AIRBORNE', '#CC44FF'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── HOSTILE FORCES (pulse #FF2040 sz=12 outer=26) ── */}
        {layers.hostile &&
          data?.hostile.map((h, i) => (
            <Marker
              key={`hostile-${i}`}
              position={[h.lat, h.lng]}
              icon={createPulseIcon('#FF2040', 12, 26)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('⬥ ' + h.name, h.detail, h.status, '#FF2040'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── NUCLEAR SITES (pulse #FFD000 sz=10 outer=22) ── */}
        {layers.nuclear &&
          data?.nuclear.map((n, i) => (
            <Marker
              key={`nuclear-${i}`}
              position={[n.lat, n.lng]}
              icon={createPulseIcon('#FFD000', 10, 22)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('☢ ' + n.name, n.detail, 'NUCLEAR', '#FFD000'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── PROXY FORCES (triangle #FF6020 sz=10 outer=16) ── */}
        {layers.proxy &&
          data?.proxies.map((p, i) => (
            <Marker
              key={`proxy-${i}`}
              position={[p.lat, p.lng]}
              icon={createTriangleIcon('#FF6020', 10)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('▲ ' + p.name, p.detail, 'PROXY FORCE', '#FF6020'),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── SHIPPING ROUTES (dashed polylines) ── */}
        {layers.routes &&
          data?.routes.map((r, i) => (
            <Polyline
              key={`route-${i}`}
              positions={r.pts}
              pathOptions={{
                color: r.col,
                weight: 2.5,
                opacity: 0.5,
                dashArray: r.dash ?? '6 8',
              }}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<div class="wim-popup-title">${r.label}</div>`,
                  }}
                />
              </Popup>
            </Polyline>
          ))}

        {/* ── CHOKEPOINTS (diamond markers) ── */}
        {layers.chokepoints &&
          data?.chokepoints.map((ch, i) => (
            <Marker
              key={`choke-${i}`}
              position={[ch.lat, ch.lng]}
              icon={createDiamondIcon(ch.col, 14)}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupHTML('◆ ' + ch.name, ch.detail, ch.status, ch.col),
                  }}
                />
              </Popup>
            </Marker>
          ))}

        {/* ── MISSILE RANGES (3 concentric dashed circles from Tehran) ── */}
        {layers.missiles &&
          data?.missileRanges.map((m, i) => (
            <Circle
              key={`missile-${i}`}
              center={[32.5, 53]}
              radius={m.radius}
              pathOptions={{
                color: '#FF2040',
                weight: 1,
                opacity: 0.2 - i * 0.05,
                fillColor: '#FF2040',
                fillOpacity: 0.03 - i * 0.008,
                dashArray: '6 8',
              }}
            />
          ))}

        {/* ── AIRSPACE ZONES (closed/restricted polygons) ── */}
        {layers.airspace &&
          data?.airspaceZones.map((z, i) => (
            <Polygon
              key={`airspace-${i}`}
              positions={z.polygon}
              pathOptions={{
                color: z.color,
                weight: z.weight,
                opacity: z.opacity,
                fillColor: z.color,
                fillOpacity: z.fillOpacity,
                dashArray: '6 4',
              }}
            >
              <Popup maxWidth={280}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      `<div class="wim-popup-title">${z.title}</div>` +
                      `<div class="wim-popup-detail">${z.detail}</div>`,
                  }}
                />
              </Popup>
            </Polygon>
          ))}
      </MapContainer>

      {/* ── Map overlays (positioned absolute over the map) ── */}

      {/* Time strip — top-left */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 10,
          zIndex: 1000,
          background: 'rgba(8,13,24,0.85)',
          border: '1px solid #1C2C42',
          borderRadius: 3,
          padding: '3px 8px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.08em',
          color: '#4E6480',
          pointerEvents: 'none',
        }}
      >
        LIVE — ZULU UTC
      </div>

      {/* Situation label — top-center */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(8,13,24,0.9)',
          border: '1px solid #1C2C42',
          borderRadius: 3,
          padding: '4px 14px',
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: '#8CA0BC',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        MIDDLE EAST CRISIS — LIVE
      </div>

      {/* Layer toggle panel — bottom-left */}
      <MapLayerPanel />
    </div>
  );
}
