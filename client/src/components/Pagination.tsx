"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pages }: { page: number; pages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  if (pages <= 1) return null;

  const range: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
      range.push(i);
    } else if (range[range.length - 1] !== "…") {
      range.push("…");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {range.map((r, i) =>
        r === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={r}
            type="button"
            onClick={() => go(r as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              r === page
                ? "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900"
                : "border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {r}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === pages}
        className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
