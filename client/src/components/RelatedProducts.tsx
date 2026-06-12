import { ProductType } from "@/types";
import ProductCard from "./ProductCard";
import { Suspense } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getSimilar = async (productId: string): Promise<ProductType[]> => {
  try {
    const res = await fetch(`${BASE}/products/${productId}/similar`, { cache: "no-store" });
    if (!res.ok) return [];
    const data: Array<{
      _id: string;
      name: string;
      description: string;
      price: number;
      salePrice?: number;
      stock: number;
      images?: string[];
      sizes?: string[];
      colors?: string[];
    }> = await res.json();

    return data.map((p) => {
      const colors = p.colors || [];
      const images = p.images || [];
      const imageMap: Record<string, string> =
        colors.length > 0
          ? Object.fromEntries(colors.map((c, i) => [c, images[i] || images[0] || "/placeholder.png"]))
          : { default: images[0] || "/placeholder.png" };
      return {
        id: p._id,
        name: p.name,
        shortDescription: p.description.length > 80 ? p.description.slice(0, 80) + "…" : p.description,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        sizes: p.sizes || [],
        colors,
        images: imageMap,
      };
    });
  } catch {
    return [];
  }
};

const RelatedProducts = async ({ productId }: { productId: string }) => {
  const products = await getSimilar(productId);
  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-xl font-medium mb-6">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Suspense key={p.id}>
            <ProductCard product={p} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
