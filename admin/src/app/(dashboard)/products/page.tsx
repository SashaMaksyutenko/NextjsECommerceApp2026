import { cookies } from "next/headers";
import { Product, columns } from "./columns";
import { DataTable } from "./data-table";

const getProducts = async (): Promise<Product[]> => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=50`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || []).map((p: {
      _id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      images?: string[];
      category?: { _id: string; name: string } | string;
      isActive: boolean;
    }) => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      images: p.images || [],
      category: typeof p.category === "object" && p.category !== null
        ? (p.category as { name: string }).name
        : (p.category as string) || "",
      isActive: p.isActive,
    }));
  } catch {
    return [];
  }
};

const ProductsPage = async () => {
  const data = await getProducts();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductsPage;
