import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type WishlistState = {
  ids: Set<string>;
  fetched: boolean;
  fetching: boolean;
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  clear: () => void;
};

const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set(),
  fetched: false,
  fetching: false,

  fetch: async () => {
    // prevent concurrent fetches and re-fetches
    if (get().fetched || get().fetching) return;
    set({ fetching: true });
    try {
      const res = await fetch(`${BASE}/wishlist`, { credentials: "include" });
      if (res.status === 401 || res.status === 429) {
        set({ fetching: false });
        return;
      }
      if (res.ok) {
        const data: { _id: string }[] = await res.json();
        set({ ids: new Set(data.map((p) => p._id)), fetched: true, fetching: false });
      } else {
        set({ fetched: true, fetching: false });
      }
    } catch {
      set({ fetched: true, fetching: false });
    }
  },

  toggle: async (productId: string) => {
    const prev = new Set(get().ids);
    const isIn = prev.has(productId);
    const next = new Set(prev);
    isIn ? next.delete(productId) : next.add(productId);
    set({ ids: next });

    try {
      const res = await fetch(`${BASE}/wishlist/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) set({ ids: prev });
    } catch {
      set({ ids: prev });
    }
  },

  clear: () => set({ ids: new Set(), fetched: false, fetching: false }),
}));

export default useWishlistStore;
