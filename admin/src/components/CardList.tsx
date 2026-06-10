import Image from "next/image"
import { cookies } from "next/headers"
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const fetchWithAuth = async (path: string) => {
  const cookieStore = await cookies()
  const res = await fetch(`${BASE}${path}`, {
    headers: { Cookie: cookieStore.toString() },
    cache: "no-store",
  })
  if (!res.ok) return null
  return res.json()
}

const CardList = async ({ title }: { title: string }) => {
  const isProducts = title === "Popular Products"

  const data = isProducts
    ? await fetchWithAuth("/products?limit=5")
    : await fetchWithAuth("/orders?limit=5")

  const items = isProducts ? (data?.products ?? []) : (data?.orders ?? [])

  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
        {isProducts
          ? items.map((item: { _id: string; name: string; price: number; images?: string[] }) => (
              <Card key={item._id} className="flex-row items-center justify-between gap-4 p-4">
                <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-secondary">
                  {item.images?.[0] && (
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                </CardContent>
                <CardFooter className="p-0">${item.price}</CardFooter>
              </Card>
            ))
          : items.map((item: {
              _id: string;
              user?: { username: string; avatar?: string };
              totalPrice: number;
              status: string;
            }) => (
              <Card key={item._id} className="flex-row items-center justify-between gap-4 p-4">
                <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-secondary">
                  {item.user?.avatar && (
                    <Image src={item.user.avatar} alt={item.user.username ?? ""} fill className="object-cover" />
                  )}
                </div>
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">Order Payment</CardTitle>
                  <Badge variant="secondary">{item.user?.username ?? "Unknown"}</Badge>
                </CardContent>
                <CardFooter className="p-0">${item.totalPrice}</CardFooter>
              </Card>
            ))}
      </div>
    </div>
  )
}

export default CardList
