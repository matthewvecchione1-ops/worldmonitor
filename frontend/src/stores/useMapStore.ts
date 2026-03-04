import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapLayerType } from '../types/map';

type LayerVisibility = Record<MapLayerType, boolean>;

interface MapState {
  layers: LayerVisibility;
  center: [number, number];
  zoom: number;
  toggleLayer: (layer: MapLayerType) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

const defaultLayers: LayerVisibility = {
  carriers: true,
  bases: true,
  submarines: true,
  aircraft: true,
  hostile: true,
  proxy: true,
  nuclear: true,
  routes: true,
  missiles: true,
  airspace: true,
  chokepoints: true,
};

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      layers: defaultLayers,
      center: [25, 45],
      zoom: 4,
      toggleLayer: (layer) =>
        set((state) => ({
          layers: { ...state.layers, [layer]: !state.layers[layer] },
        })),
      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
    }),
    {
      name: 'wim-map-layers',
      partialize: (state) => ({ layers: state.layers }),
    }
  )
);
