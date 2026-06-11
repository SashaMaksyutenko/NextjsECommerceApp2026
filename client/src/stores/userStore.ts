import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type AuthUser = { id: string; username: string; email: string; role: string };

type UserStore = {
  user: AuthUser | null;
  fetched: boolean;
  fetching: boolean;
  fetch: () => Promise<void>;
  clear: () => void;
};

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  fetched: false,
  fetching: false,

  fetch: async () => {
    if (get().fetched || get().fetching) return;
    set({ fetching: true });
    try {
      const res = await fetch(`${BASE}/auth/me`, { credentials: "include" });
      if (res.status === 429) {
        set({ fetching: false }); // allow retry later
        return;
      }
      if (res.ok) set({ user: await res.json(), fetched: true, fetching: false });
      else set({ user: null, fetched: true, fetching: false });
    } catch {
      set({ user: null, fetched: true, fetching: false });
    }
  },

  clear: () => set({ user: null, fetched: false, fetching: false }),
}));

export default useUserStore;
