"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronDown, Heart, LayoutDashboard, LogOut, ShoppingBag, UserRound } from "lucide-react";
import useUserStore from "@/stores/userStore";
import useWishlistStore from "@/stores/wishlistStore";
import useCartStore from "@/stores/cartStore";

export default function AuthButton() {
  const { user, fetch: fetchUser, clear: clearUser } = useUserStore();
  const { clear: clearWishlist } = useWishlistStore();
  const { clearCart } = useCartStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && sessionStorage.getItem("just-logged-in")) {
      toast.success(`Welcome, ${user.username}!`, { autoClose: 3000 });
      sessionStorage.removeItem("just-logged-in");
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearUser();
    clearWishlist();
    clearCart();
    setOpen(false);
    toast.info("Signed out successfully");
    router.refresh();
  };

  if (!user) {
    return (
      <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
        Sign In
      </Link>
    );
  }

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 group"
      >
        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold select-none">
          {initials}
        </div>
        <ChevronDown
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-1.5 text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full tracking-wide">
                ADMIN
              </span>
            )}
          </div>

          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <UserRound className="w-4 h-4 shrink-0" />
              My Profile
            </Link>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              My Orders
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Heart className="w-4 h-4 shrink-0" />
              My Wishlist
            </Link>

            {user.role === "admin" && (
              <a
                href="http://localhost:3000"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors font-medium"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                Admin Dashboard
              </a>
            )}

            <div className="mx-4 my-1 border-t border-gray-100" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
