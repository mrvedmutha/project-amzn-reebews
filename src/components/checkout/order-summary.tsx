import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BillingCycle } from "@/enums/checkout.enum";
import { OrderSummaryProps } from "@/types/props/orderSummary.props";

export function OrderSummary({
  planDetails,
  plan,
  billingCycle,
  setBillingCycle,
  currency,
  finalPrice,
  originalPrice,
  discountAmount,
  showDiscount,
  formatPrice,
}: OrderSummaryProps) {
  // Get available upgrade and downgrade options
  const getUpgradeOptions = () => {
    const upgrades = planDetails.upgrades || [];
    const downgrades = planDetails.downgrades || [];
    return [...upgrades, ...downgrades];
  };

  // Get plan name for UI display
  const getPlanName = (planId: string) => {
    switch (planId) {
      case "free":
        return "Free Plan";
      case "basic":
        return "Basic Plan";
      case "pro":
        return "Pro Plan";
      default:
        return "Basic Plan";
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 sticky top-24">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Plan</span>
          <span className="font-medium">{planDetails.name}</span>
        </div>

        {plan !== "free" && (
          <div className="flex justify-between">
            <span>Billing Cycle</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBillingCycle(BillingCycle.MONTHLY)}
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
                onClick={() => setBillingCycle(BillingCycle.YEARLY)}
                className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${
                  billingCycle === BillingCycle.YEARLY
                    ? "bg-yellow-500 text-black font-medium"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                Yearly
                {billingCycle === BillingCycle.YEARLY &&
                  planDetails.yearlyDiscountPercent &&
                  planDetails.yearlyDiscountPercent > 0 && (
                    <span className="text-xs font-bold">
                      -{planDetails.yearlyDiscountPercent}%
                    </span>
                  )}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <span>Description</span>
          <span className="text-muted-foreground">
            {planDetails.description}
          </span>
        </div>

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <div className="flex flex-col items-end">
            {billingCycle === BillingCycle.YEARLY &&
              planDetails.yearlyDiscountPercent &&
              planDetails.yearlyDiscountPercent > 0 &&
              showDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {currency === "USD"
                    ? `$${formatPrice(originalPrice.USD)}`
                    : `₹${formatPrice(originalPrice.INR)}`}
                  /{billingCycle === BillingCycle.MONTHLY ? "month" : "year"}
                </span>
              )}
            <span>
              {currency === "USD"
                ? `$${formatPrice(finalPrice.USD)}`
                : `₹${formatPrice(finalPrice.INR)}`}
              {plan !== "free" &&
                `/${billingCycle === BillingCycle.MONTHLY ? "month" : "year"}`}
            </span>
            {showDiscount && plan !== "free" && (
              <span className="text-xs text-green-500">
                {currency === "USD"
                  ? `$${formatPrice(discountAmount.USD)}`
                  : `₹${formatPrice(discountAmount.INR)}`}{" "}
                off
              </span>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Plan Features:</h4>
          <ul className="space-y-1 text-sm">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Additional Options:</h4>
          <div className="space-y-2">
            {getUpgradeOptions().map((planOption) => (
              <Link
                key={planOption}
                href={`/checkout?plan=${planOption}&billing=${billingCycle}`}
                className="flex items-center justify-between p-2 border rounded hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  {planOption === "pro" && plan !== "pro" && (
                    <Badge className="bg-green-500">Upgrade</Badge>
                  )}
                  {planOption === "basic" && plan === "pro" && (
                    <Badge variant="outline">Downgrade</Badge>
                  )}
                  {planOption === "basic" && plan === "free" && (
                    <Badge className="bg-green-500">Upgrade</Badge>
                  )}
                  <span>{getPlanName(planOption)}</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground space-y-2">
            {plan !== "free" && (
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
