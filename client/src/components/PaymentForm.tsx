"use client";

import { PaymentFormInputs, paymentFormSchema, ShippingFormInputs } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useCartStore from "@/stores/cartStore";

const PaymentForm = ({ shippingForm }: { shippingForm: ShippingFormInputs }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormInputs>({
    resolver: zodResolver(paymentFormSchema),
  });
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePaymentForm: SubmitHandler<PaymentFormInputs> = async () => {
    setError("");
    setLoading(true);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 100 ? 0 : 9.99;

    const orderPayload = {
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        street: shippingForm.address,
        city: shippingForm.city,
        country: shippingForm.country,
        zip: shippingForm.zip,
      },
      shippingFee,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Order failed"); return; }

      clearCart();
      router.push("/orders");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handlePaymentForm)}>
      <div className="flex flex-col gap-1">
        <label htmlFor="cardHolder" className="text-xs text-gray-500 font-medium">Name on card</label>
        <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cardHolder" placeholder="John Doe" {...register("cardHolder")} />
        {errors.cardHolder && <p className="text-xs text-red-500">{errors.cardHolder.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="cardNumber" className="text-xs text-gray-500 font-medium">Card Number</label>
        <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cardNumber" placeholder="1234567891234567" {...register("cardNumber")} />
        {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="expirationDate" className="text-xs text-gray-500 font-medium">Expiration Date</label>
        <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="expirationDate" placeholder="01/26" {...register("expirationDate")} />
        {errors.expirationDate && <p className="text-xs text-red-500">{errors.expirationDate.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="cvv" className="text-xs text-gray-500 font-medium">CVV</label>
        <input className="border-b border-gray-200 py-2 outline-none text-sm" type="text" id="cvv" placeholder="123" {...register("cvv")} />
        {errors.cvv && <p className="text-xs text-red-500">{errors.cvv.message}</p>}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Image src="/klarna.png" alt="klarna" width={50} height={25} className="rounded-md" />
        <Image src="/cards.png" alt="cards" width={50} height={25} className="rounded-md" />
        <Image src="/stripe.png" alt="stripe" width={50} height={25} className="rounded-md" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Place Order"}
        <ShoppingCart className="w-3 h-3" />
      </button>
    </form>
  );
};

export default PaymentForm;
