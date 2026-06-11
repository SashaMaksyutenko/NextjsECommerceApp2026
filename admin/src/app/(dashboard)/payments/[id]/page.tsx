import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type OrderItem = {
  product: { _id: string; name: string; images: string[]; price: number } | null;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  user: { _id: string; username: string; email: string } | null;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  shippingAddress: { street: string; city: string; country: string; zip: string };
  stripePaymentIntentId?: string;
  createdAt: string;
};

const STATUS_CLASS: Record<string, string> = {
  pending:    "bg-yellow-500/30 text-yellow-800",
  processing: "bg-blue-500/30 text-blue-800",
  shipped:    "bg-purple-500/30 text-purple-800",
  delivered:  "bg-green-500/30 text-green-800",
  cancelled:  "bg-red-500/30 text-red-800",
};

const OrderDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cookieStore = await cookies();

  const res = await fetch(`${BASE}/orders/${id}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });

  if (!res.ok) return notFound();
  const order: Order = await res.json();

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/payments">Orders</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>#{id.slice(-6).toUpperCase()}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: items */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-primary-foreground rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="flex flex-col gap-3">
              {order.items.map((item, i) =>
                item.product ? (
                  <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100 flex-shrink-0">
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
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ) : null
              )}
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: order info */}
        <div className="space-y-4">
          <div className="bg-primary-foreground rounded-lg p-4 space-y-3">
            <h2 className="text-lg font-semibold">Order Info</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-foreground">ID: </span>#{id.slice(-6).toUpperCase()}</p>
              <p>
                <span className="text-muted-foreground">Status: </span>
                <span className={cn("px-2 py-0.5 rounded-full text-xs capitalize", STATUS_CLASS[order.status] ?? "bg-gray-100")}>
                  {order.status}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Date: </span>
                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              {order.stripePaymentIntentId && (
                <p className="truncate">
                  <span className="text-muted-foreground">Stripe PI: </span>
                  <span className="font-mono text-xs">{order.stripePaymentIntentId}</span>
                </p>
              )}
            </div>
          </div>

          {order.user && (
            <div className="bg-primary-foreground rounded-lg p-4 space-y-2">
              <h2 className="text-lg font-semibold">Customer</h2>
              <p className="text-sm font-medium">{order.user.username}</p>
              <p className="text-sm text-muted-foreground">{order.user.email}</p>
              <Link
                href={`/users/${order.user._id}`}
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                View profile →
              </Link>
            </div>
          )}

          <div className="bg-primary-foreground rounded-lg p-4 space-y-2">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
