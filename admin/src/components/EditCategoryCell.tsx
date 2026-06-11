"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Props {
  categoryId: string;
  defaultValues: { name: string; slug: string; description?: string };
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
}

export default function EditCategoryCell({ categoryId, defaultValues }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: defaultValues.name,
      slug: defaultValues.slug,
      description: defaultValues.description ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const res = await fetch(`${BASE}/categories/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Category</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name", { required: true })} />
            {errors.name && <p className="text-xs text-red-500">Required</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug", { required: true })} />
            {errors.slug && <p className="text-xs text-red-500">Required</p>}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
