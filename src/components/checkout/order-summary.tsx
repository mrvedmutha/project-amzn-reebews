"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { BillingCycle } from "@/enums/checkout.enum";
import { IPlan } from "@/types/plan/plan.types";
import { useCurrency } from "../currency-toggle"; // Assuming path
import { OrderSummarySkeleton } from "./order-summary-skeleton";

export function OrderSummary() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();

  // Component state from URL
  const planName = searchParams.get("plan") || "basic";
  const initialBillingCycle =
    (searchParams.get("billing") as BillingCycle) || BillingCycle.MONTHLY;

  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>(initialBillingCycle);

  // Fetch all active plans
  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<IPlan[]>({
    queryKey: ["activePlans"],
    queryFn: async () => {
      const response = await fetch("/api/plans/active");
      if (!response.ok) throw new Error("Failed to fetch plans.");
      const data = await response.json();
      return data.plans;
    },
  });

  // Find the current plan from the fetched list
  const currentPlan = React.useMemo(
    () => plans?.find((p) => p.name === planName),
    [plans, planName]
  );

  // Calculate all prices dynamically
  const { finalPrice, originalPrice, discountAmount, showDiscount } =
    React.useMemo(() => {
      if (!currentPlan)
        return {
          finalPrice: { USD: 0, INR: 0 },
          originalPrice: { USD: 0, INR: 0 },
          discountAmount: { USD: 0, INR: 0 },
          showDiscount: false,
        };

      const isYearly = billingCycle === BillingCycle.YEARLY;
      const price = isYearly
        ? currentPlan.pricing.yearly
        : currentPlan.pricing.monthly;
      let final = { ...price };
      let original = { ...price };
      let discount = { USD: 0, INR: 0 };
      let show = false;

      if (isYearly && currentPlan.yearlyDiscountPercent) {
        const discountPercent = currentPlan.yearlyDiscountPercent / 100;
        final.USD = Math.round(price.USD * (1 - discountPercent));
        final.INR = Math.round(price.INR * (1 - discountPercent));
        discount = {
          USD: price.USD - final.USD,
          INR: price.INR - final.INR,
        };
        show = true;
      }

      return {
        finalPrice: final,
        originalPrice: original,
        discountAmount: discount,
        showDiscount: show,
      };
    }, [currentPlan, billingCycle]);

  // Handle billing cycle changes and update URL
  const handleSetBillingCycle = (cycle: BillingCycle) => {
    setBillingCycle(cycle);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("billing", cycle);
    router.replace(`/checkout?${newParams.toString()}`);
  };

  if (isLoading) return <OrderSummarySkeleton />;
  if (isError || !currentPlan)
    return (
      <div className="bg-card rounded-lg border p-6 text-center">
        Error loading plan details. Please try again.
      </div>
    );

  const getPlanName = (planId: string) =>
    plans?.find((p) => p.name === planId)?.displayName || planId;

  const planOptions =
    plans
      ?.filter((p) => p.name !== planName && p.name !== "enterprise")
      .sort((a, b) => a.sortOrder - b.sortOrder) || [];

  return (
    <div className="bg-card rounded-lg border p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Plan</span>
          <span className="font-medium">{currentPlan.displayName}</span>
        </div>

        {planName !== "free" && (
          <div className="flex justify-between">
            <span>Billing Cycle</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetBillingCycle(BillingCycle.MONTHLY)}
                className={`text-sm px-2 py-1 rounded ${
                  billingCycle === BillingCycle.MONTHLY
                    ? "bg-yellow-500 text-black font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleSetBillingCycle(BillingCycle.YEARLY)}
                className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${
                  billingCycle === BillingCycle.YEARLY
                    ? "bg-yellow-500 text-black font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Yearly
                {billingCycle === BillingCycle.YEARLY &&
                  currentPlan.yearlyDiscountPercent && (
                    <span className="text-xs font-bold">
                      -{currentPlan.yearlyDiscountPercent}%
                    </span>
                  )}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <div className="flex flex-col items-end">
            {showDiscount && planName !== "free" && (
              <span className="text-sm line-through text-muted-foreground">
                {currency === "USD"
                  ? `$${originalPrice.USD}`
                  : `₹${originalPrice.INR}`}
                /{billingCycle === BillingCycle.MONTHLY ? "month" : "year"}
              </span>
            )}
            <span>
              {currency === "USD" ? `$${finalPrice.USD}` : `₹${finalPrice.INR}`}
              {planName !== "free" &&
                `/${billingCycle === BillingCycle.MONTHLY ? "month" : "year"}`}
            </span>
            {showDiscount && planName !== "free" && (
              <span className="text-xs text-green-500">
                You save{" "}
                {currency === "USD"
                  ? `$${discountAmount.USD}`
                  : `₹${discountAmount.INR}`}
              </span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Plan Features:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {/* This part needs to be dynamically generated from plan features */}
            <li>{currentPlan.features.numberOfProducts} Products</li>
            <li>{currentPlan.features.numberOfCampaigns} Campaigns</li>
            <li>
              {currentPlan.features.monthlyReviews === "unlimited"
                ? "Unlimited"
                : currentPlan.features.monthlyReviews}{" "}
              Reviews/month
            </li>
            <li>
              {currentPlan.features.whiteLabel ? "No" : "Yes"} Reebews branding
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Change Plan:</h4>
          <div className="space-y-2">
            {planOptions.map((planOption) => (
              <Link
                key={planOption.name}
                href={`/checkout?plan=${planOption.name}&billing=${billingCycle}`}
                className="flex items-center justify-between p-2 border rounded hover:bg-muted transition-colors"
                replace
              >
                <div className="flex items-center gap-2">
                  {planOption.sortOrder > currentPlan.sortOrder && (
                    <Badge className="bg-green-500">Upgrade</Badge>
                  )}
                  {planOption.sortOrder < currentPlan.sortOrder && (
                    <Badge variant="outline">Downgrade</Badge>
                  )}
                  <span>{getPlanName(planOption.name)}</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground space-y-2">
            {planName !== "free" && (
              <>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Secure checkout</span>
                </div>
                <p>
                  Your payment information is processed securely. We do not
                  store credit card details.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
