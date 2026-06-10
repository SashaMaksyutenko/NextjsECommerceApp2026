import { cookies } from "next/headers"
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

export default async function HomePage() {
  const analytics = await fetchAnalytics()

  return <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
    <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <AppBarChart data={analytics?.monthlyRevenue} />
    </div>
    <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Latest Transactions"/></div>
    <div className="bg-primary-foreground p-4 rounded-lg"><AppPieChart data={analytics?.ordersByStatus} /></div>
    <div className="bg-primary-foreground p-4 rounded-lg"><TodoList/></div>
    <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2"><AppAreaChart/></div>
    <div className="bg-primary-foreground p-4 rounded-lg"><CardList title="Popular Products"/></div>
  </div>
}
