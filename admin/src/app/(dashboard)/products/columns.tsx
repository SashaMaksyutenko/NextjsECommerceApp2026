"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Image from "next/image"
import { DeleteProductCell } from "@/components/DeleteProductCell"

export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  isActive: boolean
}

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original
      const src = product.images?.[0]
      return src ? (
        <div className="relative h-9 w-9">
          <Image src={src} alt={product.name} fill className="rounded-full object-cover" />
        </div>
      ) : (
        <div className="h-9 w-9 rounded-full bg-secondary" />
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `$${row.getValue<number>("price").toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <span className={`rounded-md px-2 py-1 text-xs ${row.getValue("isActive") ? "bg-green-500/40" : "bg-red-500/40"}`}>
        {row.getValue("isActive") ? "active" : "inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DeleteProductCell productId={row.original.id} />,
  },
]
