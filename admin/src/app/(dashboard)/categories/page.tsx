import { cookies } from "next/headers";
import DeleteCategoryCell from "@/components/DeleteCategoryCell";
import EditCategoryCell from "@/components/EditCategoryCell";
import AddCategorySheet from "@/components/AddCategorySheet";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

async function getCategories(cookieHeader: string): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE}/categories`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const categories = await getCategories(cookieStore.toString());

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold">All Categories</h1>
        <AddCategorySheet />
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium w-24" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-t hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.description ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <EditCategoryCell
                        categoryId={cat._id}
                        defaultValues={{ name: cat.name, slug: cat.slug, description: cat.description }}
                      />
                      <DeleteCategoryCell categoryId={cat._id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
