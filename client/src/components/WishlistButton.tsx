"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import useWishlistStore from "@/stores/wishlistStore";
import { toast } from "react-toastify";

export default function WishlistButton({ productId }: { productId: string }) {
  const { ids, fetched, fetch, toggle } = useWishlistStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const inWishlist = ids.has(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!fetched) return;
    await toggle(productId);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <button
      onClick={handleClick}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow transition-colors"
    >
      <Heart
        className={`w-4 h-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
      />
    </button>
  );
}
