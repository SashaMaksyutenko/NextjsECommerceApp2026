import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PaymentSuccessBanner from "@/components/PaymentSuccessBanner";
import { Suspense } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  product: { _id: string; name: string; images: string[]; price: number } | null;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingAddress: { street: string; city: string; country: string; zip: string };
  createdAt: string;
};

async function getMyOrders(): Promise<Order[] | null> {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE}/orders/my`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) return [];
  return res.json();
}

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  if (orders === null) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Suspense><PaymentSuccessBanner /></Suspense>
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="underline text-gray-700 hover:text-black">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                    STATUS_CLASSES[order.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {order.items.map((item, i) =>
                  item.product ? (
                    <div key={i} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} &times; ${item.price}
                        </p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </span>
                <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
