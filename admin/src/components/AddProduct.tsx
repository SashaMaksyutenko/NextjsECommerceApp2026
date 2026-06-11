"use client";

import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const COLORS = ["blue","green","red","yellow","purple","orange","pink","brown","gray","black","white"] as const;
const COLOR_BG: Record<string, string> = {
  blue:"bg-blue-500", green:"bg-green-500", red:"bg-red-500", yellow:"bg-yellow-400",
  purple:"bg-purple-500", orange:"bg-orange-500", pink:"bg-pink-400", brown:"bg-amber-800",
  gray:"bg-gray-400", black:"bg-black", white:"bg-white border border-gray-300",
};
const SIZES = ["xs","s","m","l","xl","xxl","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48"] as const;

const formSchema = z.object({
  name:        z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price:       z.coerce.number().min(0),
  stock:       z.coerce.number().int().min(0),
  category:    z.string().min(1, "Category is required"),
  sizes:       z.array(z.string()).optional(),
  colors:      z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Category = { _id: string; name: string };

const AddProduct = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { sizes: [], colors: [] },
  });

  useEffect(() => {
    fetch(`${BASE}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 4));
    e.target.value = "";
  };

  const removePreview = (idx: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setUploading(true);
    try {
      const images: string[] = [];
      for (const { file } of previews) {
        const fd = new FormData();
        fd.append("image", file);
        const up = await fetch(`${BASE}/upload`, { method: "POST", credentials: "include", body: fd });
        if (!up.ok) throw new Error("Failed to upload image");
        const { url } = await up.json();
        images.push(url);
      }

      const res = await fetch(`${BASE}/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, images }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create product");
      }

      form.reset();
      setPreviews([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SheetContent>
      <ScrollArea className="h-screen pr-4">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-8">
                {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

                {/* Images */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Images <span className="text-muted-foreground text-xs">(up to 4)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {previews.map(({ url }, idx) => (
                      <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removePreview(idx)}
                          className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {previews.length < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-muted-foreground/60 transition-colors"
                      >
                        <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Add photo</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </div>

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map((cat) => <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                                const cur = field.value ?? [];
                                field.onChange(checked ? [...cur, size] : cur.filter((v) => v !== size));
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
                    <FormDescription>Select available colors.</FormDescription>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {COLORS.map((color) => (
                          <div key={color} className="flex items-center gap-1.5">
                            <Checkbox
                              checked={field.value?.includes(color)}
                              onCheckedChange={(checked) => {
                                const cur = field.value ?? [];
                                field.onChange(checked ? [...cur, color] : cur.filter((v) => v !== color));
                              }}
                            />
                            <span className="text-xs flex items-center gap-1">
                              <span className={`w-3 h-3 rounded-full inline-block ${COLOR_BG[color] ?? "bg-gray-400"}`} />
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Uploading..." : "Add Product"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
