import ProductList from "@/components/ProductList";

const ProductsPage = async ({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) => {
  const { category, sort } = await searchParams;
  return (
    <div className="">
      <ProductList category={category} sort={sort} params="products" />
    </div>
  );
};

export default ProductsPage;
