import AppSidebar from "@/components/AppSidebar"
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

async function getMe(cookieHeader: string): Promise<{ username: string } | null> {
  try {
    const res = await fetch(`${BASE}/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  const me = await getMe(cookieStore.toString())

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar username={me?.username} />
      <main className="w-full">
        <Navbar />
        <div className="px-4">{children}</div>
      </main>
    </SidebarProvider>
  )
}
