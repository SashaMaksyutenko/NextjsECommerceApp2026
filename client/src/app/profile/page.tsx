"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type UserData = { id: string; username: string; email: string; role: string };

const BASE = process.env.NEXT_PUBLIC_API_URL!;

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) { router.replace("/login"); return; }
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      const res = await fetch(`${BASE}/users/${user!.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, role: user!.role }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.message || "Failed to update"); return; }
      toast.success("Profile updated");
      setUser((u) => u ? { ...u, username, email } : u);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    setSavingPw(true);
    try {
      const res = await fetch(`${BASE}/auth/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.message || "Failed"); return; }
      toast.success("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" /></div>;
  if (!user) return null;

  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto py-10 space-y-8">
      {/* Avatar + header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{user.username}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.role === "admin" && (
            <span className="inline-block text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full mt-1 tracking-wide">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Edit info */}
      <form onSubmit={handleSaveInfo} className="border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Profile Info</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Username</label>
          <input
            className="border-b border-gray-200 dark:border-gray-700 py-2 outline-none text-sm bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            className="border-b border-gray-200 dark:border-gray-700 py-2 outline-none text-sm bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={savingInfo}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
        >
          {savingInfo ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handleChangePassword} className="border border-gray-100 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Change Password</h2>
        {[
          { label: "Current password", value: currentPassword, setter: setCurrentPassword },
          { label: "New password", value: newPassword, setter: setNewPassword },
          { label: "Confirm new password", value: confirmPassword, setter: setConfirmPassword },
        ].map(({ label, value, setter }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-sm text-gray-500">{label}</label>
            <input
              type="password"
              className="border-b border-gray-200 dark:border-gray-700 py-2 outline-none text-sm bg-transparent"
              value={value}
              onChange={(e) => setter(e.target.value)}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={savingPw}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
        >
          {savingPw ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
