"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DeleteCategoryCell({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    await fetch(`${BASE}/categories/${categoryId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={loading}
      onClick={handleDelete}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
