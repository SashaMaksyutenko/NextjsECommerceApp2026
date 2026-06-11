"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [10, 20, 40];

export default function PerPage({ limit }: { limit: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = (val: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", String(val));
    params.set("page", "1");
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>Show:</span>
      {OPTIONS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => set(n)}
          className={`px-2 py-1 rounded transition-colors ${
            n === limit
              ? "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 font-medium"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
