"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const COLORS = [
  "blue", "green", "red", "yellow", "purple",
  "orange", "pink", "brown", "gray", "black", "white",
] as const;

const COLOR_BG: Record<string, string> = {
  blue:   "bg-blue-500",
  green:  "bg-green-500",
  red:    "bg-red-500",
  yellow: "bg-yellow-400",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink:   "bg-pink-400",
  brown:  "bg-amber-800",
  gray:   "bg-gray-400",
  black:  "bg-black",
  white:  "bg-white border border-gray-300",
};

const SIZES = [
  "xs", "s", "m", "l", "xl", "xxl",
  "34", "35", "36", "37", "38", "39", "40",
  "41", "42", "43", "44", "45", "46", "47", "48",
] as const;

const formSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price:       z.coerce.number().min(0),
  stock:       z.coerce.number().int().min(0),
  category:    z.string().min(1, "Category is required"),
  isActive:    z.boolean(),
  sizes:       z.array(z.string()).optional(),
  colors:      z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Category = { _id: string; name: string };

interface Props {
  productId: string;
  defaultValues: FormValues & { images?: string[] };
}

const EditProduct = ({ productId, defaultValues }: Props) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const selectedColors = form.watch("colors") ?? [];

  useEffect(() => {
    fetch(`${BASE}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setSuccess(false);
    setUploading(true);
    try {
      const images: string[] = defaultValues.images ?? [];
      let uploadedAny = false;
      for (const color of selectedColors) {
        const file = fileRefs.current[color]?.files?.[0];
        if (file) {
          const fd = new FormData();
          fd.append("image", file);
          const up = await fetch(`${BASE}/upload`, {
            method: "POST",
            credentials: "include",
            body: fd,
          });
          if (!up.ok) throw new Error(`Failed to upload image for color: ${color}`);
          const { url } = await up.json();
          const idx = (defaultValues.colors ?? []).indexOf(color);
          if (idx >= 0 && idx < images.length) {
            images[idx] = url;
          } else {
            images.push(url);
          }
          uploadedAny = true;
        }
      }

      const res = await fetch(`${BASE}/products/${productId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...(uploadedAny ? { images } : {}) }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to update product");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">Product updated.</p>
        )}

        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="price" render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="stock" render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="!mt-0">Active (visible on storefront)</FormLabel>
          </FormItem>
        )} />

        <FormField control={form.control} name="sizes" render={({ field }) => (
          <FormItem>
            <FormLabel>Sizes</FormLabel>
            <FormDescription>Select available sizes.</FormDescription>
            <FormControl>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {SIZES.map((size) => (
                  <div key={size} className="flex items-center gap-1">
                    <Checkbox
                      checked={field.value?.includes(size)}
                      onCheckedChange={(checked) => {
                        const current = field.value ?? [];
                        field.onChange(checked ? [...current, size] : current.filter((v) => v !== size));
                      }}
                    />
                    <span className="text-xs">{size}</span>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="colors" render={({ field }) => (
          <FormItem>
            <FormLabel>Colors</FormLabel>
            <FormDescription>Select colors and optionally replace images.</FormDescription>
            <FormControl>
              <div className="space-y-3 mt-1">
                <div className="grid grid-cols-3 gap-2">
                  {COLORS.map((color) => (
                    <div key={color} className="flex items-center gap-1">
                      <Checkbox
                        checked={field.value?.includes(color)}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? [];
                          field.onChange(checked ? [...current, color] : current.filter((v) => v !== color));
                        }}
                      />
                      <span className="text-xs flex items-center gap-1">
                        <span className={`w-3 h-3 rounded-full inline-block ${COLOR_BG[color] ?? "bg-gray-400"}`} />
                        {color}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedColors.length > 0 && (
                  <div className="space-y-2 border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground">Replace image (leave empty to keep existing):</p>
                    {selectedColors.map((color) => (
                      <div key={color} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${COLOR_BG[color] ?? "bg-gray-400"}`} />
                        <span className="text-xs min-w-15">{color}</span>
                        <Input
                          type="file"
                          accept="image/*"
                          className="text-xs h-8"
                          ref={(el) => { fileRefs.current[color] = el; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" className="w-full" disabled={uploading}>
          {uploading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditProduct;
