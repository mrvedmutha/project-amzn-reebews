"use client";

import * as React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "./currency-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { usePlans } from "@/hooks/plans/use-plans.hook";
import { transformToPricingPlan } from "@/utils/plan-helpers";
import { PricingSkeleton } from "@/components/skeletons/pricing-skeleton";

interface PricingPlan {
  title: string;
  description: string;
  price: {
    monthly: { USD: number; INR: number };
    yearly: { USD: number; INR: number };
  };
  features: Array<{ name: string; included: boolean }>;
  isMostPopular?: boolean;
  ctaText: string;
  ctaLink: string;
  yearlyDiscountPercent?: number;
}

export function Pricing() {
  const { currency } = useCurrency();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const router = useRouter();
  const { plans, isLoading, error } = usePlans();

  // Transform API plans to pricing component format, but keep Enterprise static
  const pricingPlans: PricingPlan[] = React.useMemo(() => {
    if (!plans || plans.length === 0) return [];

    const apiPlans = plans.map((plan) =>
      transformToPricingPlan(plan, currency, billingCycle)
    );

    // Add Enterprise plan (keep static as requested)
    const enterprisePlan: PricingPlan = {
      title: "Enterprise",
      description: "Custom solutions for large sellers",
      price: {
        monthly: { USD: 0, INR: 0 },
        yearly: { USD: 0, INR: 0 },
      },
      features: [
        { name: "Unlimited Products", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "Unlimited Promotions", included: true },
        { name: "All Marketplaces", included: true },
        { name: "Unlimited Reviews", included: true },
        { name: "Custom domain support", included: true },
        { name: "Dedicated support", included: true },
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact",
    };

    return [...apiPlans, enterprisePlan];
  }, [plans, currency, billingCycle]);

  const formatPrice = (plan: PricingPlan) => {
    const price = plan.price[billingCycle][currency];
    if (price === 0 && plan.title === "Enterprise") return "Custom";
    if (price === 0) return "Free";

    return currency === "USD" ? `$${price}` : `₹${price}`;
  };

  // Show loading skeleton while fetching plans
  if (isLoading) {
    return <PricingSkeleton />;
  }

  // Show error message if API fails
  if (error) {
    return (
      <div id="pricing" className="w-full py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Let's Talk About <span className="text-yellow-500">Pricing</span>
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-700">Failed to load pricing plans</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="pricing" className="w-full py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">
            Let's Talk About <span className="text-yellow-500">Pricing</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto">
            Choose the plan that's right for your business needs
          </p>

          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center justify-center gap-4 relative">
              <Label
                htmlFor="billing-toggle"
                className={`text-sm font-medium ${
                  billingCycle === "monthly"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={billingCycle === "yearly"}
                onCheckedChange={(checked: boolean) =>
                  setBillingCycle(checked ? "yearly" : "monthly")
                }
              />
              <Label
                htmlFor="billing-toggle"
                className={`text-sm font-medium flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Yearly
                {billingCycle === "yearly" &&
                  pricingPlans.some(
                    (plan) =>
                      plan.yearlyDiscountPercent &&
                      plan.yearlyDiscountPercent > 0
                  ) && (
                    <span className="text-xs text-yellow-500 font-bold">
                      Save{" "}
                      {Math.max(
                        ...pricingPlans.map(
                          (plan) => plan.yearlyDiscountPercent || 0
                        )
                      )}
                      %
                    </span>
                  )}
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.title}
              className={`relative flex flex-col ${
                plan.isMostPopular ? "border-yellow-500 shadow-lg" : ""
              }`}
            >
              {plan.isMostPopular && (
                <Badge className="absolute -top-2 right-5 bg-yellow-500 hover:bg-yellow-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  {billingCycle === "yearly" &&
                  plan.yearlyDiscountPercent &&
                  plan.yearlyDiscountPercent > 0 ? (
                    <>
                      <span className="text-4xl font-bold">
                        {currency === "USD"
                          ? `$${(plan.price.yearly.USD / 12).toFixed(0)}`
                          : `₹${(plan.price.yearly.INR / 12).toFixed(0)}`}
                      </span>
                      <span className="text-sm">/month</span>
                      <div className="text-xs text-muted-foreground mt-1">
                        billed yearly
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        {formatPrice(plan)}
                      </span>
                      {plan.price[billingCycle][currency] > 0 && (
                        <span className="text-sm">/month</span>
                      )}
                      {plan.price[billingCycle][currency] > 0 &&
                        billingCycle === "yearly" && (
                          <div className="text-xs text-muted-foreground mt-1">
                            billed yearly
                          </div>
                        )}
                    </>
                  )}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                      )}
                      <span className="text-sm">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.isMostPopular ? "default" : "outline"}
                  disabled={loadingPlan === plan.title}
                  onClick={async (e) => {
                    e.preventDefault();
                    setLoadingPlan(plan.title);
                    // Small delay to show loading state
                    setTimeout(() => {
                      router.push(plan.ctaLink);
                    }, 600);
                  }}
                >
                  {loadingPlan === plan.title ? "Please wait..." : plan.ctaText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Review costs: {currency === "USD" ? "$0.08" : "₹5"} per review (
            {currency === "USD" ? "$8" : "₹500"} per 100 reviews)
          </p>
        </div>
      </div>
    </div>
  );
}
