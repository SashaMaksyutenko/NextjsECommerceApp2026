"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; username: string; email: string; role: string };

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-600">Hi, {user.username}</span>
        <Link href="/orders" className="underline text-gray-500 hover:text-black">
          My Orders
        </Link>
        <button onClick={handleLogout} className="underline text-gray-500 hover:text-black">
          Sign Out
        </button>
      </div>
    );
  }

  return <Link href="/login" className="text-sm">Sign In</Link>;
}
