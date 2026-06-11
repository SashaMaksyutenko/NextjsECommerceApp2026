"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

const PaymentSuccessBanner = () => {
  const params = useSearchParams();
  if (params.get("payment") !== "success") return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
      <CheckCircle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">Payment successful — your order has been placed!</p>
    </div>
  );
};

export default PaymentSuccessBanner;
