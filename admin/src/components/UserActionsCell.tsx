"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export function UserActionsCell({
  userId,
  isActive,
}: {
  userId: string
  isActive: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const toggleStatus = async () => {
    setLoading(true)
    await fetch(`${BASE}/users/${userId}/toggle`, {
      method: "PATCH",
      credentials: "include",
    })
    setLoading(false)
    router.refresh()
  }

  const deleteUser = async () => {
    if (!confirm("Delete this user permanently?")) return
    setLoading(true)
    await fetch(`${BASE}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/users/${userId}`}>View profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleStatus}>
          {isActive ? "Deactivate" : "Activate"} user
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={deleteUser}
          className="text-red-600 focus:text-red-600"
        >
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
