import { create } from "zustand";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type WishlistState = {
  ids: Set<string>;
  fetched: boolean;
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set(),
  fetched: false,

  fetch: async () => {
    if (get().fetched) return;
    try {
      const res = await fetch(`${BASE}/wishlist`, { credentials: "include" });
      if (!res.ok) return;
      const data: { _id: string }[] = await res.json();
      set({ ids: new Set(data.map((p) => p._id)), fetched: true });
    } catch {
      set({ fetched: true });
    }
  },

  toggle: async (productId: string) => {
    const prev = new Set(get().ids);
    const isIn = prev.has(productId);

    // Optimistic update
    const next = new Set(prev);
    isIn ? next.delete(productId) : next.add(productId);
    set({ ids: next });

    try {
      const res = await fetch(`${BASE}/wishlist/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) set({ ids: prev }); // rollback on error
    } catch {
      set({ ids: prev });
    }
  },
}));

export default useWishlistStore;
