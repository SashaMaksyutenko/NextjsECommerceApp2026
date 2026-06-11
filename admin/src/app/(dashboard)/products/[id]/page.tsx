import EditProduct from "@/components/EditProduct";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RawProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: { _id: string; name: string } | string;
  isActive: boolean;
}

async function getProduct(id: string, cookieHeader: string): Promise<RawProduct | null> {
  try {
    const res = await fetch(`${BASE}/products/${id}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const product = await getProduct(id, cookieStore.toString());
  if (!product) return notFound();

  const categoryId =
    typeof product.category === "object" && product.category !== null
      ? product.category._id
      : (product.category as string) ?? "";

  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : "";

  const defaultValues = {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: categoryId,
    isActive: product.isActive,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    images: product.images ?? [],
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <div>
          <h1 className="font-semibold">{product.name}</h1>
          <p className="text-xs text-muted-foreground">{categoryName}</p>
        </div>
        <span className={`text-xs rounded px-2 py-1 ${product.isActive ? "bg-green-500/30" : "bg-red-500/30"}`}>
          {product.isActive ? "active" : "inactive"}
        </span>
      </div>

      {product.images.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {product.images.map((src, i) => (
            <div key={i} className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
              <Image src={src} alt={`image-${i}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <EditProduct productId={id} defaultValues={defaultValues} />
    </div>
  );
}
