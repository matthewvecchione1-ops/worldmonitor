import { useMapStore } from '../../stores/useMapStore';
import type { MapLayerType } from '../../types/map';

interface LayerItem {
  label: string;
  layers: MapLayerType[];
  color: string;
}

const LAYER_ITEMS: LayerItem[] = [
  { label: 'US Carrier Groups',  layers: ['carriers'],              color: '#00AAFF' },
  { label: 'US / Allied Bases',  layers: ['bases'],                 color: '#55CCFF' },
  { label: 'Submarine Patrols',  layers: ['submarines'],            color: '#1A8FFF' },
  { label: 'Aircraft / ISR',     layers: ['aircraft'],              color: '#CC44FF' },
  { label: 'Hostile Forces',     layers: ['hostile'],               color: '#FF2040' },
  { label: 'Proxy Forces',       layers: ['proxy'],                 color: '#FF6020' },
  { label: 'Nuclear Sites',      layers: ['nuclear'],               color: '#FFD000' },
  { label: 'Shipping Routes',    layers: ['routes', 'chokepoints'], color: '#00D878' },
  { label: 'Missile Ranges',     layers: ['missiles'],              color: '#FF2040' },
  { label: 'Closed Airspace',    layers: ['airspace'],              color: '#FF2040' },
];

export default function MapLayerPanel() {
  const { layers, toggleLayer } = useMapStore();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 10,
        zIndex: 1000,
        background: 'rgba(8,13,24,0.92)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #1C2C42',
        borderRadius: 5,
        padding: '8px 10px',
        minWidth: 148,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 8,
          letterSpacing: '0.18em',
          color: '#4E6480',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        LAYERS
      </div>

      {/* Layer rows */}
      {LAYER_ITEMS.map((item) => {
        const on = item.layers.every((k) => layers[k]);
        return (
          <div
            key={item.label}
            className="flex items-center gap-1.5 cursor-pointer"
            style={{ marginBottom: 4 }}
            onClick={() => {
              item.layers.forEach((k) => toggleLayer(k));
            }}
          >
            {/* Tick */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                width: 10,
                color: on ? '#00CCFF' : '#2E4A6A',
                flexShrink: 0,
              }}
            >
              {on ? '✓' : '–'}
            </span>

            {/* Color dot */}
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: on ? item.color : '#2E4A6A',
                flexShrink: 0,
              }}
            />

            {/* Label */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: on ? '#8CA0BC' : '#2E4A6A',
                letterSpacing: '0.04em',
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
