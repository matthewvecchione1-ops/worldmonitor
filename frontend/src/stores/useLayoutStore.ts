import { create } from 'zustand';

export type MonitorRole = 'default' | 'command' | 'intel' | 'markets' | 'ops' | 'analyst' | 'all';

/** Which panels are visible for each role */
const ROLE_VISIBILITY: Record<MonitorRole, { sidebar: boolean; rail: boolean }> = {
  default:  { sidebar: true,  rail: true  },
  intel:    { sidebar: true,  rail: true  },
  markets:  { sidebar: true,  rail: true  },
  ops:      { sidebar: true,  rail: true  },
  analyst:  { sidebar: true,  rail: true  },
  command:  { sidebar: false, rail: false },
  all:      { sidebar: false, rail: false },
};

interface LayoutState {
  activeRole: MonitorRole;
  sidebarVisible: boolean;
  railVisible: boolean;
  digestOpen: boolean;
  searchOpen: boolean;
  notificationsOpen: boolean;
  multiMonitorOpen: boolean;
  /** Change role and auto-update sidebar/rail visibility */
  setRole: (role: MonitorRole) => void;
  setDigestOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setNotificationsOpen: (v: boolean) => void;
  setMultiMonitorOpen: (v: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeRole: 'default',
  sidebarVisible: true,
  railVisible: true,
  digestOpen: false,
  searchOpen: false,
  notificationsOpen: false,
  multiMonitorOpen: false,

  setRole: (role) =>
    set({
      activeRole: role,
      sidebarVisible: ROLE_VISIBILITY[role].sidebar,
      railVisible: ROLE_VISIBILITY[role].rail,
    }),

  setDigestOpen: (v) => set({ digestOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setNotificationsOpen: (v) => set({ notificationsOpen: v }),
  setMultiMonitorOpen: (v) => set({ multiMonitorOpen: v }),
}));
