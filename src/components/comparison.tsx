"use client";

import * as React from "react";
import { Check, X, HelpCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "./currency-toggle";

export function Comparison() {
  const { currency } = useCurrency();

  type Feature = {
    name: string;
    free: string | boolean;
    basic: string | boolean;
    pro: string | boolean;
    enterprise: string | boolean;
    tooltip?: string;
  };

  const reviewPrice = currency === "USD" ? "$0.08" : "₹5";
  const basicProductPrice = currency === "USD" ? "$5" : "₹70";
  const proProductPrice = currency === "USD" ? "$3" : "₹50";
  const freeProductPrice = currency === "USD" ? "$8" : "₹125";

  const features: Feature[] = [
    {
      name: "Number of Products",
      free: "3",
      basic: "5",
      pro: "25",
      enterprise: "Unlimited",
    },
    {
      name: "Number of Campaigns",
      free: "1",
      basic: "5",
      pro: "25",
      enterprise: "Unlimited",
      tooltip:
        "Campaigns allow you to organize and track different review collection strategies",
    },
    {
      name: "Number of Promotions",
      free: "1",
      basic: "5",
      pro: "Unlimited",
      enterprise: "Unlimited",
      tooltip:
        "Promotions are the incentives you offer to customers in exchange for reviews",
    },
    {
      name: "Marketplaces",
      free: "1",
      basic: "5",
      pro: "10",
      enterprise: "All",
      tooltip:
        "Amazon marketplaces you can collect reviews for (US, UK, EU, India, etc.)",
    },
    {
      name: "Monthly Reviews",
      free: "10",
      basic: "Unlimited",
      pro: "Unlimited",
      enterprise: "Unlimited",
    },
    {
      name: "Additional Reviews Cost",
      free: reviewPrice + "/review",
      basic: false,
      pro: false,
      enterprise: false,
    },
    {
      name: "Additional Products",
      free: freeProductPrice + "/product",
      basic: basicProductPrice + "/product",
      pro: proProductPrice + "/product",
      enterprise: false,
      tooltip: "Cost to add more products beyond your plan's included amount",
    },
    {
      name: "White Labeling",
      free: false,
      basic: true,
      pro: true,
      enterprise: true,
      tooltip: "Remove Reebews branding from customer-facing content",
    },
    {
      name: "Custom Domain",
      free: false,
      basic: false,
      pro: false,
      enterprise: true,
      tooltip: "Use your own custom domain for your review pages",
    },
    {
      name: "Email Support",
      free: true,
      basic: true,
      pro: true,
      enterprise: true,
    },
    {
      name: "Priority Support",
      free: false,
      basic: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "Dedicated Account Manager",
      free: false,
      basic: false,
      pro: false,
      enterprise: true,
    },
    {
      name: "Analytics Dashboard",
      free: "Basic",
      basic: "Advanced",
      pro: "Advanced",
      enterprise: "Custom",
    },
    {
      name: "Review Filtering",
      free: true,
      basic: true,
      pro: true,
      enterprise: true,
      tooltip: "Filter out negative reviews before they appear on Amazon",
    },
    {
      name: "Customer Segmentation",
      free: false,
      basic: false,
      pro: true,
      enterprise: true,
      tooltip: "Target specific customer groups with tailored campaigns",
    },
  ];

  return (
    <div id="comparison" className="w-full py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">
            <span className="text-yellow-500">Feature</span> Comparison
          </h2>
          <p className="text-lg max-w-xl mx-auto">
            Compare our plans to find the perfect fit for your business
          </p>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <TooltipProvider>
            <Table>
              <TableCaption>
                A detailed comparison of Reebews pricing plans
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center justify-center">
                      Basic
                      <Badge className="mt-1 bg-yellow-500 hover:bg-yellow-600">
                        Popular
                      </Badge>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Pro</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        {feature.name}
                        {feature.tooltip && (
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-red-500" />
                        )
                      ) : (
                        feature.free
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.basic === "boolean" ? (
                        feature.basic ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-red-500" />
                        )
                      ) : (
                        feature.basic
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-red-500" />
                        )
                      ) : (
                        feature.pro
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-red-500" />
                        )
                      ) : (
                        feature.enterprise
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
