import { cookies } from "next/headers"
import { ShoppingCart, UserPlus } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import Link from "next/link"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const STATUS_DOT: Record<string, string> = {
  pending:    "bg-yellow-400",
  processing: "bg-blue-400",
  shipped:    "bg-purple-400",
  delivered:  "bg-green-400",
  cancelled:  "bg-red-400",
}

type RawOrder = {
  _id: string
  user?: { username?: string; email?: string } | null
  totalPrice: number
  status: string
  createdAt: string
}

type RawUser = {
  _id: string
  username: string
  email: string
  createdAt: string
}

type ActivityItem =
  | { kind: "order"; id: string; label: string; sub: string; amount: number; status: string; date: Date }
  | { kind: "user";  id: string; label: string; sub: string; date: Date }

async function fetchActivity(): Promise<ActivityItem[]> {
  try {
    const cookieStore = await cookies()
    const headers = { Cookie: cookieStore.toString() }

    const [ordersRes, usersRes] = await Promise.all([
      fetch(`${BASE}/orders?limit=5`, { headers, cache: "no-store" }),
      fetch(`${BASE}/users?limit=3`,  { headers, cache: "no-store" }),
    ])

    const orders: RawOrder[] = ordersRes.ok ? await ordersRes.json() : []
    const usersData = usersRes.ok ? await usersRes.json() : {}
    const users: RawUser[] = Array.isArray(usersData) ? usersData : (usersData.users ?? [])

    const orderItems: ActivityItem[] = orders.map((o) => ({
      kind:   "order",
      id:     o._id,
      label:  `New order — $${o.totalPrice.toFixed(2)}`,
      sub:    o.user?.username ?? o.user?.email ?? "Guest",
      amount: o.totalPrice,
      status: o.status,
      date:   new Date(o.createdAt),
    }))

    const userItems: ActivityItem[] = users.map((u) => ({
      kind:  "user",
      id:    u._id,
      label: `New user — ${u.username}`,
      sub:   u.email,
      date:  new Date(u.createdAt),
    }))

    return [...orderItems, ...userItems].sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch {
    return []
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  <  1) return "just now"
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const RecentActivity = async () => {
  const items = await fetchActivity()

  return (
    <div>
      <h1 className="mb-4 text-lg font-medium">Recent Activity</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      ) : (
        <ScrollArea className="max-h-[340px]">
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.kind === "order" ? `/payments` : `/users/${item.id}`}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-secondary transition-colors"
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.kind === "order" ? "bg-blue-500/15" : "bg-green-500/15"
                }`}>
                  {item.kind === "order"
                    ? <ShoppingCart className="h-4 w-4 text-blue-500" />
                    : <UserPlus    className="h-4 w-4 text-green-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.sub}</p>
                </div>
                <div className="shrink-0 text-right">
                  {item.kind === "order" && (
                    <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[item.status] ?? "bg-gray-400"}`} />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(item.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default RecentActivity
