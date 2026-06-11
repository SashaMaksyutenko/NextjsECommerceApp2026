import ProductList from "@/components/ProductList";

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; search?: string; page?: string; limit?: string }>;
}) => {
  const { category, sort, search, page, limit } = await searchParams;
  return (
    <div>
      <ProductList
        category={category}
        sort={sort}
        search={search}
        page={page ? +page : 1}
        limit={limit ? +limit : 20}
        params="products"
      />
    </div>
  );
};

export default ProductsPage;
