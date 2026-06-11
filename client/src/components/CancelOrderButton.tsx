"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cancel = async () => {
    if (!confirm("Cancel this order?")) return;
    setLoading(true);
    const res = await fetch(`${BASE}/orders/${orderId}/cancel`, {
      method: "POST",
      credentials: "include",
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Order cancelled");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.message || "Failed to cancel order");
    }
  };

  return (
    <button
      onClick={cancel}
      disabled={loading}
      className="text-xs text-red-500 border border-red-300 rounded px-2 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {loading ? "Cancelling…" : "Cancel"}
    </button>
  );
}
