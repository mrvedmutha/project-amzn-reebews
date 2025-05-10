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
}

export function Pricing() {
  const { currency } = useCurrency();
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  );

  const pricingPlans: PricingPlan[] = [
    {
      title: "Free",
      description: "Get started with the basics",
      price: {
        monthly: { USD: 0, INR: 0 },
        yearly: { USD: 0, INR: 0 },
      },
      features: [
        { name: "3 Products", included: true },
        { name: "1 Campaign", included: true },
        { name: "1 Promotion", included: true },
        { name: "1 Marketplace", included: true },
        { name: "10 Reviews per month", included: true },
        { name: "Reebews branding", included: true },
        {
          name: `Additional products at ${
            currency === "USD" ? "$8" : "₹125"
          } per product`,
          included: true,
        },
      ],
      ctaText: "Get Started",
      ctaLink: `/checkout?plan=free`,
    },
    {
      title: "Basic",
      description: "Perfect for small sellers",
      price: {
        monthly: { USD: 29, INR: 499 },
        yearly: { USD: 25, INR: 425 },
      },
      features: [
        { name: "5 Products", included: true },
        { name: "5 Campaigns", included: true },
        { name: "5 Promotions", included: true },
        { name: "5 Marketplaces", included: true },
        { name: "Unlimited Reviews", included: true },
        { name: "No Reebews branding", included: true },
        {
          name: `Additional products at ${
            currency === "USD" ? "$5" : "₹70"
          } per product`,
          included: true,
        },
      ],
      isMostPopular: true,
      ctaText: "Choose Basic",
      ctaLink: `/checkout?plan=basic&billing=${billingCycle}`,
    },
    {
      title: "Pro",
      description: "For growing businesses",
      price: {
        monthly: { USD: 49, INR: 999 },
        yearly: { USD: 35, INR: 699 },
      },
      features: [
        { name: "25 Products", included: true },
        { name: "25 Campaigns", included: true },
        { name: "Unlimited Promotions", included: true },
        { name: "10 Marketplaces", included: true },
        { name: "Unlimited Reviews", included: true },
        { name: "No Reebews branding", included: true },
        {
          name: `Additional products at ${
            currency === "USD" ? "$3" : "₹50"
          } per product`,
          included: true,
        },
      ],
      ctaText: "Choose Pro",
      ctaLink: `/checkout?plan=pro&billing=${billingCycle}`,
    },
    {
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
    },
  ];

  const formatPrice = (plan: PricingPlan) => {
    const price = plan.price[billingCycle][currency];
    if (price === 0 && plan.title === "Enterprise") return "Custom";
    if (price === 0) return "Free";

    return currency === "USD" ? `$${price}` : `₹${price}`;
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
                  <span className="text-4xl font-bold">
                    {formatPrice(plan)}
                  </span>
                  {plan.price[billingCycle][currency] > 0 && (
                    <span className="text-sm">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
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
                  asChild
                  className="w-full"
                  variant={plan.isMostPopular ? "default" : "outline"}
                >
                  <Link href={plan.ctaLink}>{plan.ctaText}</Link>
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
