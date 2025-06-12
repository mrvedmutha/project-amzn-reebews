import { Suspense } from "react";

import { CheckoutContent } from "@/components/checkout/checkout-content";
import { CheckoutSkeleton } from "@/components/checkout-skeleton";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
