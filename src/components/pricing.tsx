"use client";

import * as React from "react";
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
import { IPlan } from "@/types/plan/plan.types";
import { PricingSkeleton } from "./pricing-skeleton";

export function Pricing() {
  const { currency } = useCurrency();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [plans, setPlans] = React.useState<IPlan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/plans/active");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        setPlans(data.plans);
      } catch (error) {
        console.error(error);
        // Handle error state, maybe show a toast
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (plan: IPlan) => {
    // Always calculate the effective monthly price from the yearly total
    // to ensure the display is consistent regardless of the toggle.
    const price =
      plan.name === "free" || plan.name === "enterprise"
        ? plan.pricing.monthly[currency]
        : plan.pricing.yearly[currency] / 12;

    if (plan.name === "enterprise") return "Custom";
    if (price === 0) return "Free";

    const formattedPrice =
      currency === "USD" ? `$${price.toFixed(0)}` : `₹${price.toFixed(0)}`;

    return formattedPrice;
  };

  const getPlanFeatures = (plan: IPlan) => {
    const { features } = plan;
    const featureList = [
      {
        name: `${features.numberOfProducts} Products`,
        included: true,
      },
      {
        name: `${features.numberOfCampaigns} Campaigns`,
        included: true,
      },
      {
        name: `${features.numberOfPromotions} Promotions`,
        included: true,
      },
      { name: `${features.marketplaces} Marketplaces`, included: true },
      {
        name: `${
          features.monthlyReviews === "unlimited"
            ? "Unlimited"
            : features.monthlyReviews
        } Reviews per month`,
        included: true,
      },
      { name: "Reebews branding", included: !features.whiteLabel },
      {
        name: `Additional products at ${
          currency === "USD"
            ? `$${features.additionalProductsCost.additionalProducts.USD}`
            : `₹${features.additionalProductsCost.additionalProducts.INR}`
        } per product`,
        included:
          features.additionalProductsCost.additionalProducts.USD > 0 ||
          features.additionalProductsCost.additionalProducts.INR > 0,
      },
    ];

    if (plan.name === "enterprise") {
      return [
        { name: "Unlimited Products", included: true },
        { name: "Unlimited Campaigns", included: true },
        { name: "Unlimited Promotions", included: true },
        { name: "All Marketplaces", included: true },
        { name: "Unlimited Reviews", included: true },
        { name: "Custom domain support", included: true },
        { name: "Dedicated support", included: true },
      ];
    }

    return featureList;
  };

  const getCtaInfo = (plan: IPlan) => {
    if (plan.name === "enterprise") {
      return { text: "Contact Sales", link: "/contact" };
    }
    if (plan.name === "free") {
      return { text: "Get Started", link: "/checkout?plan=free" };
    }
    return {
      text: `Choose ${plan.displayName.split(" ")[0]}`,
      link: `/checkout?plan=${plan.name}&billing=${billingCycle}`,
    };
  };

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
                <span className="text-xs text-yellow-500 font-bold">
                  Save up to 30%
                </span>
              </Label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <PricingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const cta = getCtaInfo(plan);
              const isMostPopular = plan.name === "basic"; // Example logic

              return (
                <Card
                  key={plan.name}
                  className={`relative flex flex-col ${
                    isMostPopular ? "border-yellow-500 shadow-lg" : ""
                  }`}
                >
                  {isMostPopular && (
                    <Badge className="absolute -top-2 right-5 bg-yellow-500 hover:bg-yellow-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {plan.displayName}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        {formatPrice(plan)}
                      </span>
                      {plan.pricing.monthly[currency] > 0 &&
                        plan.name !== "enterprise" && (
                          <span className="text-sm">/month</span>
                        )}
                      {billingCycle === "yearly" &&
                        plan.name !== "free" &&
                        plan.name !== "enterprise" && (
                          <div className="text-xs text-muted-foreground mt-1">
                            billed yearly
                          </div>
                        )}
                    </div>
                    <ul className="space-y-2">
                      {getPlanFeatures(plan).map((feature, i) => (
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
                      variant={isMostPopular ? "default" : "outline"}
                      disabled={loadingPlan === plan.name}
                      onClick={async (e) => {
                        e.preventDefault();
                        setLoadingPlan(plan.name);
                        // Small delay to show loading state
                        setTimeout(() => {
                          router.push(cta.link);
                        }, 600);
                      }}
                    >
                      {loadingPlan === plan.name ? "Please wait..." : cta.text}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
