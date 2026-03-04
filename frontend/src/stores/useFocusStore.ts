import { create } from 'zustand';

interface FocusState {
  focusedCountryId: string | null;
  focusedEntityId: string | null;
  openCountryFocus: (id: string) => void;
  closeCountryFocus: () => void;
  openEntityFocus: (id: string) => void;
  closeEntityFocus: () => void;
}

export const useFocusStore = create<FocusState>((set) => ({
  focusedCountryId: null,
  focusedEntityId: null,
  openCountryFocus: (id) => set({ focusedCountryId: id }),
  closeCountryFocus: () => set({ focusedCountryId: null }),
  openEntityFocus: (id) => set({ focusedEntityId: id }),
  closeEntityFocus: () => set({ focusedEntityId: null }),
}));
