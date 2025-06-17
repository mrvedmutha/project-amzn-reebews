"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { ThankYouContent } from "@/components/checkout/thank-you-content";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const signupToken = searchParams.get("token");

  useEffect(() => {
    // If we have a signup token, redirect to subdomain
    if (signupToken) {
      const subdomainUrl = process.env.NEXT_PUBLIC_SUBDOMAIN_URL;
      window.location.href = `${subdomainUrl}/signup?token=${signupToken}`;
    }
  }, [signupToken]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
