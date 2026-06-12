"use client";

import useCartStore from "@/stores/cartStore";
import useUserStore from "@/stores/userStore";
import { ProductType } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import WishlistButton from "./WishlistButton";

const ProductCard = ({ product }: { product: ProductType }) => {
  const firstColor = product.colors[0] || "default";
  const firstImage = product.images[firstColor] || Object.values(product.images)[0] || "/placeholder.png";

  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0] || "",
    color: firstColor,
  });

  const { addToCart } = useCartStore();
  const { user, fetch: fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleProductType = ({ type, value }: { type: "size" | "color"; value: string }) => {
    setProductTypes((prev) => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please sign in to add items to your cart");
      router.push("/login");
      return;
    }
    addToCart({
      ...product,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="shadow-lg rounded-lg overflow-hidden">
      {/* IMAGE */}
      <div className="relative aspect-[2/3]">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.images[productTypes.color] || firstImage}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-all duration-300"
          />
        </Link>
        {product.salePrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
            Sale
          </span>
        )}
        <WishlistButton productId={String(product.id)} />
      </div>

      {/* PRODUCT DETAIL */}
      <div className="flex flex-col gap-4 p-4">
        <h1 className="font-medium">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.shortDescription}</p>

        {/* OPTIONS */}
        <div className="flex items-center gap-4 text-xs">
          {product.sizes.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Size</span>
              <select
                name="size"
                className="ring ring-gray-300 rounded-md px-2 py-1"
                onChange={(e) => handleProductType({ type: "size", value: e.target.value })}
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size.toUpperCase()}</option>
                ))}
              </select>
            </div>
          )}
          {product.colors.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">Color</span>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => handleProductType({ type: "color", value: color })}
                    className={`border rounded-full p-[1.2px] ${productTypes.color === color ? "border-gray-400" : "border-gray-200"}`}
                  >
                    <span
                      className="block w-[14px] h-[14px] rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PRICE + CART */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-medium">
              ${(product.salePrice ?? product.price).toFixed(2)}
            </p>
            {product.salePrice && (
              <p className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="ring ring-gray-200 shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer hover:text-white hover:bg-black transition-all duration-300 flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
