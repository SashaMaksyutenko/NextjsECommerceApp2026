import { ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import Pagination from "./Pagination";
import PerPage from "./PerPage";
import { Suspense } from "react";

const mapProduct = (p: {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  category?: { name: string } | string;
  isActive: boolean;
}): ProductType => {
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
    stock: p.stock,
    sizes: p.sizes || [],
    colors,
    images: imageMap,
    category:
      typeof p.category === "object" && p.category !== null
        ? p.category.name
        : (p.category ?? ""),
    isActive: p.isActive,
  };
};

const getProducts = async (
  category?: string,
  sort?: string,
  search?: string,
  page = 1,
  limit = 20,
): Promise<{ products: ProductType[]; total: number; pages: number }> => {
  try {
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (category && category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { products: [], total: 0, pages: 0 };
    const data = await res.json();
    return {
      products: (data.products || []).map(mapProduct),
      total: data.total || 0,
      pages: data.pages || 1,
    };
  } catch {
    return { products: [], total: 0, pages: 0 };
  }
};

const ProductList = async ({
  category,
  sort,
  search,
  page = 1,
  limit = 20,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  page?: number;
  limit?: number;
  params: "homepage" | "products";
}) => {
  const { products, total, pages } = await getProducts(category, sort, search, page, limit);
  const isHomepage = params === "homepage";

  return (
    <div className="w-full">
      <Suspense><Categories /></Suspense>

      {/* toolbar — only on /products */}
      {!isHomepage && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">{total} products</p>
          <div className="flex items-center gap-4">
            <Suspense><Filter /></Suspense>
            <Suspense><PerPage limit={limit} /></Suspense>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center py-12">No products found.</p>
        )}
      </div>

      {/* homepage footer */}
      {isHomepage && products.length > 0 && (
        <Link
          href={category && category !== "all" ? `/products?category=${category}` : "/products"}
          className="flex justify-end mt-6 underline text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          View all products →
        </Link>
      )}

      {/* products page pagination */}
      {!isHomepage && (
        <Suspense><Pagination page={page} pages={pages} /></Suspense>
      )}
    </div>
  );
};

export default ProductList;
