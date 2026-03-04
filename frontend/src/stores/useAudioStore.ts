import { create } from 'zustand';

interface AudioState {
  enabled: boolean;
  volume: number;
  toggleAudio: () => void;
  setVolume: (v: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  enabled: false,
  volume: 0.3,
  toggleAudio: () => set((state) => ({ enabled: !state.enabled })),
  setVolume: (v) => set({ volume: v }),
}));
