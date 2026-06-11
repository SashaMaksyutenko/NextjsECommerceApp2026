import { cookies } from "next/headers";
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react"
import EditUserSheet from "@/components/EditUserSheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetchWithAuth = async (path: string) => {
  const cookieStore = await cookies();
  const res = await fetch(`${BASE}${path}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
};

const STATUS_CLASS: Record<string, string> = {
  pending:    "bg-yellow-500/30 text-yellow-800",
  processing: "bg-blue-500/30 text-blue-800",
  shipped:    "bg-purple-500/30 text-purple-800",
  delivered:  "bg-green-500/30 text-green-800",
  cancelled:  "bg-red-500/30 text-red-800",
};

const SingleUserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const [user, ordersData] = await Promise.all([
    fetchWithAuth(`/users/${id}`) as Promise<UserData | null>,
    fetchWithAuth(`/orders?userId=${id}&limit=10`),
  ]);

  const orders: Order[] = Array.isArray(ordersData)
    ? ordersData
    : (ordersData?.orders ?? []);

  const displayName = user?.username || "Unknown User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US")
    : "N/A";

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/users">Users</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{displayName}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex flex-col gap-8 xl:flex-row">
        {/* LEFT */}
        <div className="w-full space-y-6 xl:w-1/3">
          {/* BADGES */}
          <div className="rounded-lg bg-primary-foreground p-4">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="mt-4 flex gap-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck size={36} className="rounded-full border border-blue-500/50 bg-blue-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Verified User</h1>
                  <p className="text-sm text-muted-foreground">This user has been verified.</p>
                </HoverCardContent>
              </HoverCard>
              {user?.role === "admin" && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield size={36} className="rounded-full border border-green-800/50 bg-green-800/30 p-2" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="mb-2 font-bold">Admin</h1>
                    <p className="text-sm text-muted-foreground">Has access to all features.</p>
                  </HoverCardContent>
                </HoverCard>
              )}
              <HoverCard>
                <HoverCardTrigger>
                  <Candy size={36} className="rounded-full border border-yellow-500/50 bg-yellow-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Awarded</h1>
                  <p className="text-sm text-muted-foreground">Awarded for their contributions.</p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus size={36} className="rounded-full border border-orange-500/50 bg-orange-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Popular</h1>
                  <p className="text-sm text-muted-foreground">Popular in the community.</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>

          {/* USER CARD */}
          <div className="space-y-2 rounded-lg bg-primary-foreground p-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{displayName}</h1>
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* INFORMATION */}
          <div className="rounded-lg bg-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>
              {user && (
                <EditUserSheet
                  userId={user._id}
                  defaultValues={{ username: user.username, email: user.email, role: user.role }}
                />
              )}
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold">Username:</span>
                <span>{user?.username || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{user?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Role:</span>
                <span className="capitalize">{user?.role || "—"}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Joined on {joinedDate}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full space-y-6 xl:w-2/3">
          <div className="rounded-lg bg-primary-foreground p-4">
            <h1 className="text-xl font-semibold mb-4">Recent Orders</h1>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between border-b pb-2 text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_CLASS[order.status] ?? "bg-gray-100"}`}
                    >
                      {order.status}
                    </span>
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
