import { ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";

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
    category: typeof p.category === "object" && p.category !== null ? p.category.name : (p.category ?? ""),
    isActive: p.isActive,
  };
};

const getProducts = async (category?: string, sort?: string, search?: string): Promise<ProductType[]> => {
  try {
    const params = new URLSearchParams({ limit: "20" });
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).map(mapProduct);
  } catch {
    return [];
  }
};

const ProductList = async ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const products = await getProducts(category, sort, search);

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-12">No products found.</p>
        )}
      </div>
      {params === "homepage" && (
        <Link
          href={category ? `/products/?category=${category}` : "/products"}
          className="flex justify-end mt-4 underline text-sm text-gray-500"
        >
          View all products
        </Link>
      )}
    </div>
  );
};

export default ProductList;
