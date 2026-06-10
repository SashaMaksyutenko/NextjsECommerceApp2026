import { cookies } from "next/headers"
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function fetchAnalytics() {
  try {
    const cookieStore = await cookies()
    const res = await fetch(`${BASE}/analytics`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const statCards = [
  { key: "totalUsers",    label: "Total Users",    icon: Users,        format: (v: number) => v.toLocaleString() },
  { key: "totalProducts", label: "Total Products", icon: Package,      format: (v: number) => v.toLocaleString() },
  { key: "totalOrders",   label: "Total Orders",   icon: ShoppingCart, format: (v: number) => v.toLocaleString() },
  { key: "totalRevenue",  label: "Total Revenue",  icon: DollarSign,   format: (v: number) => `$${v.toLocaleString()}` },
] as const

export default async function HomePage() {
  const analytics = await fetchAnalytics()
  const summary = analytics?.summary ?? {}

  return (
    <div className="flex flex-col gap-4">
      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="bg-primary-foreground p-4 rounded-lg flex items-center gap-4">
            <div className="p-2 rounded-full bg-secondary">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-semibold">{format(summary[key] ?? 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
          <AppBarChart data={analytics?.monthlyRevenue} />
        </div>
        <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Latest Transactions"/></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><AppPieChart data={analytics?.ordersByStatus} /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><TodoList/></div>
        <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppAreaChart data={analytics?.monthlyRevenue} /></div>
        <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Popular Products"/></div>
      </div>
    </div>
  )
}
