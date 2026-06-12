import ProductInteraction from "@/components/ProductInteraction";
import ReviewSection from "@/components/ReviewSection";
import RelatedProducts from "@/components/RelatedProducts";
import { ProductType } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const getProduct = async (id: string): Promise<ProductType | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const p = await res.json();
    const colors: string[] = p.colors || [];
    const images: string[] = p.images || [];
    const imageMap: Record<string, string> =
      colors.length > 0
        ? Object.fromEntries(colors.map((c: string, i: number) => [c, images[i] || images[0] || "/placeholder.png"]))
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
      categorySlug: p.category?.slug,
    };
  } catch {
    return null;
  }
};

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Product Not Found" };
};

const ProductPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ color?: string; size?: string }>;
}) => {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  const { color, size } = await searchParams;
  const selectedColor = color || product.colors[0] || "default";
  const selectedSize = size || product.sizes[0] || "";
  const imageSrc = product.images[selectedColor] || Object.values(product.images)[0] || "/placeholder.png";

  return (
    <>
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>
      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            ${(product.salePrice ?? product.price).toFixed(2)}
          </h2>
          {product.salePrice && (
            <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
          {product.salePrice && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">Sale</span>
          )}
        </div>
        <Suspense>
          <ProductInteraction
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />
        </Suspense>
        <div className="flex items-center gap-2 mt-4">
          <Image src="/klarna.png" alt="klarna" width={50} height={25} className="rounded-md" />
          <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md" />
          <Image src="/stripe.png" alt="stripe" width={50} height={25} className="rounded-md" />
        </div>
        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>.
          You authorize us to charge your selected payment method for the total amount shown.
          All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
    <ReviewSection productId={id} />
    <RelatedProducts productId={id} />
    </>
  );
};

export default ProductPage;
