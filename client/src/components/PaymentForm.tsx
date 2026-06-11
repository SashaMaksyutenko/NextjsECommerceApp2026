"use client";

import { ShippingFormInputs } from "@/types";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type CheckoutFormProps = {
  paymentIntentId: string;
  shippingForm: ShippingFormInputs;
  totalPrice: number;
};

const CheckoutForm = ({ paymentIntentId, shippingForm, totalPrice }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders?payment=success` },
      redirect: "if_required",
    });

    if (result.error) {
      setError(result.error.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    // Payment confirmed — create order now (idempotent via paymentIntentId)
    await fetch(`${BASE}/orders/confirm`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          street:  shippingForm.address,
          city:    shippingForm.city,
          country: shippingForm.country,
          zip:     shippingForm.zip,
        },
        totalPrice,
      }),
    });

    clearCart();
    router.push("/orders?payment=success");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Place Order"}
        <ShoppingCart className="w-3 h-3" />
      </button>
    </form>
  );
};

const PaymentForm = ({ shippingForm }: { shippingForm: ShippingFormInputs }) => {
  const { cart } = useCartStore();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [initError, setInitError] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || cart.length === 0) return;
    initialized.current = true;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal + shippingFee;
    setTotalPrice(total);

    fetch(`${BASE}/payments/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        items: cart.map((item) => ({ product: item.id, quantity: item.quantity, price: item.price })),
        shippingFee,
      }),
    })
      .then((res) => {
        if (res.status === 401) { router.push("/login"); return null; }
        return res.json();
      })
      .then((data) => {
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        } else {
          setInitError("Could not initialise payment. Try again.");
        }
      })
      .catch(() => setInitError("Something went wrong. Try again."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initError) return <p className="text-sm text-red-500">{initError}</p>;

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <CheckoutForm
        paymentIntentId={paymentIntentId}
        shippingForm={shippingForm}
        totalPrice={totalPrice}
      />
    </Elements>
  );
};

export default PaymentForm;
