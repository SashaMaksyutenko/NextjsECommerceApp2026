"use client";

import { useEffect, useState, FormEvent } from "react";
import { Star } from "lucide-react";
import { toast } from "react-toastify";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Review = {
  _id: string;
  user: { username: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
};

type ReviewData = { reviews: Review[]; avgRating: number; total: number };

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-5 h-5 transition-colors ${
            n <= (hover || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${onChange ? "cursor-pointer" : ""}`}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(n)}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ productId }: { productId: string }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${BASE}/products/${productId}/reviews`);
      if (res.ok) setData(await res.json());
    } catch {}
  };

  useEffect(() => { load(); }, [productId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    if (!comment.trim()) { toast.error("Please write a comment"); return; }
    setSubmitting(true);
    const res = await fetch(`${BASE}/products/${productId}/reviews`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success("Review added!");
      setRating(0);
      setComment("");
      await load();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.message || "Failed to submit review");
    }
  };

  return (
    <div className="mt-10 border-t pt-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold">Reviews</h2>
        {data && data.total > 0 && (
          <div className="flex items-center gap-1.5">
            <Stars value={Math.round(data.avgRating)} />
            <span className="text-sm text-gray-500">
              {data.avgRating} / 5 ({data.total})
            </span>
          </div>
        )}
      </div>

      {/* Add review form */}
      <form onSubmit={submit} className="mb-8 p-4 border rounded-lg flex flex-col gap-3">
        <p className="text-sm font-medium">Write a review</p>
        <Stars value={rating} onChange={setRating} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
          maxLength={500}
          className="w-full text-sm border rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="self-start px-4 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>

      {/* Reviews list */}
      {!data || data.reviews.length === 0 ? (
        <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-5">
          {data.reviews.map((r) => (
            <div key={r._id} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.user.username}</span>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
              <Stars value={r.rating} />
              <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
