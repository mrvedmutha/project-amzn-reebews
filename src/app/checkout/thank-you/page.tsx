"use client";

import { Suspense } from "react";
import { ThankYouContent } from "@/components/checkout/thank-you-content";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
