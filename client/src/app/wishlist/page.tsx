import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type WishlistProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  isActive: boolean;
};

async function getWishlist(): Promise<WishlistProduct[] | null> {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE}/wishlist`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) return [];
  return res.json();
}

export default async function WishlistPage() {
  const products = await getWishlist();
  if (products === null) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        My Wishlist
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link href="/products" className="underline text-gray-700 hover:text-black">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product._id}`} className="group block shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[2/3] bg-gray-100">
                <Image
                  src={product.images[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
