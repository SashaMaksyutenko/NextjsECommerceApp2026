"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserActionsCell } from "@/components/UserActionsCell"

export type User = {
  id: string
  avatar: string
  fullName: string
  email: string
  isActive: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const user = row.original
      return user.avatar ? (
        <div className="w-9 h-9 relative">
          <Image src={user.avatar} alt={user.fullName} fill className="rounded-full object-cover" />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-secondary" />
      )
    },
  },
  {
    accessorKey: "fullName",
    header: "User",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={cn(
          "w-max rounded-md px-2 py-1 text-xs",
          row.getValue("isActive") ? "bg-green-500/40" : "bg-red-500/40"
        )}
      >
        {row.getValue("isActive") ? "active" : "inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Link href={`/users/${row.original.id}`}>
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>
        <UserActionsCell userId={row.original.id} isActive={row.original.isActive} />
      </div>
    ),
  },
]
