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
import { IPlan } from "@/types/plan/plan.types";
import { ComparisonSkeleton } from "./comparison-skeleton";

interface Feature {
  name: string;
  tooltip?: string;
  free: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

export function Comparison() {
  const { currency } = useCurrency();
  const [plans, setPlans] = React.useState<IPlan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [features, setFeatures] = React.useState<Feature[]>([]);

  React.useEffect(() => {
    const fetchPlansAndTransform = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/plans/active");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        const fetchedPlans: IPlan[] = data.plans;
        setPlans(fetchedPlans);

        const transformPlansToFeatures = (plans: IPlan[]): Feature[] => {
          if (plans.length === 0) return [];

          const findPlan = (name: string) => plans.find((p) => p.name === name);
          const freePlan = findPlan("free");
          const basicPlan = findPlan("basic");
          const proPlan = findPlan("pro");
          const enterprisePlan = findPlan("enterprise");

          const formatValue = (value: any) => {
            if (typeof value === "boolean") return value;
            if (value === "unlimited" || value >= 99999) return "Unlimited";
            return value?.toString() ?? "-";
          };

          const formatCost = (cost: any) => {
            if (!cost) return "-";
            const price = cost[currency];
            if (!price || price === 0) return "-";
            return currency === "USD" ? `$${price}` : `₹${price}`;
          };

          const formatCostWithSuffix = (cost: any, suffix: string) => {
            const formattedCost = formatCost(cost);
            if (formattedCost === "-") return "-";
            return `${formattedCost}${suffix}`;
          };

          const comparisonFeatures: Feature[] = [
            {
              name: "Number of Products",
              tooltip: "The maximum number of products you can manage.",
              free: formatValue(freePlan?.features.numberOfProducts),
              basic: formatValue(basicPlan?.features.numberOfProducts),
              pro: formatValue(proPlan?.features.numberOfProducts),
              enterprise: formatValue(
                enterprisePlan?.features.numberOfProducts
              ),
            },
            {
              name: "Number of Campaigns",
              tooltip: "The maximum number of active review campaigns.",
              free: formatValue(freePlan?.features.numberOfCampaigns),
              basic: formatValue(basicPlan?.features.numberOfCampaigns),
              pro: formatValue(proPlan?.features.numberOfCampaigns),
              enterprise: formatValue(
                enterprisePlan?.features.numberOfCampaigns
              ),
            },
            {
              name: "Number of Promotions",
              tooltip: "The maximum number of promotions you can run.",
              free: formatValue(freePlan?.features.numberOfPromotions),
              basic: formatValue(basicPlan?.features.numberOfPromotions),
              pro: formatValue(proPlan?.features.numberOfPromotions),
              enterprise: formatValue(
                enterprisePlan?.features.numberOfPromotions
              ),
            },
            {
              name: "Marketplaces",
              tooltip: "Number of marketplaces you can connect to.",
              free: formatValue(freePlan?.features.marketplaces),
              basic: formatValue(basicPlan?.features.marketplaces),
              pro: formatValue(proPlan?.features.marketplaces),
              enterprise: formatValue(enterprisePlan?.features.marketplaces),
            },
            {
              name: "Monthly Reviews",
              tooltip: "The number of reviews you can collect per month.",
              free: formatValue(freePlan?.features.monthlyReviews),
              basic: formatValue(basicPlan?.features.monthlyReviews),
              pro: formatValue(proPlan?.features.monthlyReviews),
              enterprise: formatValue(enterprisePlan?.features.monthlyReviews),
            },
            {
              name: "Additional Reviews Cost",
              tooltip: "Cost for reviews beyond the monthly limit.",
              free: formatCostWithSuffix(
                freePlan?.features.additionalProductsCost.additionalReviews,
                "/review"
              ),
              basic: formatCostWithSuffix(
                basicPlan?.features.additionalProductsCost.additionalReviews,
                "/review"
              ),
              pro: formatCostWithSuffix(
                proPlan?.features.additionalProductsCost.additionalReviews,
                "/review"
              ),
              enterprise: formatCostWithSuffix(
                enterprisePlan?.features.additionalProductsCost
                  .additionalReviews,
                "/review"
              ),
            },
            {
              name: "Additional Products",
              tooltip: "Cost for adding products beyond the plan limit.",
              free: formatCostWithSuffix(
                freePlan?.features.additionalProductsCost.additionalProducts,
                "/product"
              ),
              basic: formatCostWithSuffix(
                basicPlan?.features.additionalProductsCost.additionalProducts,
                "/product"
              ),
              pro: formatCostWithSuffix(
                proPlan?.features.additionalProductsCost.additionalProducts,
                "/product"
              ),
              enterprise: formatCostWithSuffix(
                enterprisePlan?.features.additionalProductsCost
                  .additionalProducts,
                "/product"
              ),
            },
            {
              name: "Yearly Plan Discount",
              tooltip:
                "The discount you receive when you opt for a yearly subscription.",
              free: `${freePlan?.yearlyDiscountPercent ?? 0}%`,
              basic: `${basicPlan?.yearlyDiscountPercent ?? 0}%`,
              pro: `${proPlan?.yearlyDiscountPercent ?? 0}%`,
              enterprise: "Custom",
            },
            {
              name: "White Labeling",
              tooltip: "Remove Reebews branding from your communications.",
              free: freePlan?.features.whiteLabel ?? false,
              basic: basicPlan?.features.whiteLabel ?? false,
              pro: proPlan?.features.whiteLabel ?? false,
              enterprise: enterprisePlan?.features.whiteLabel ?? false,
            },
            {
              name: "Custom Domain",
              tooltip: "Use your own domain for review collection pages.",
              free: freePlan?.features.customDomain ?? false,
              basic: basicPlan?.features.customDomain ?? false,
              pro: proPlan?.features.customDomain ?? false,
              enterprise: enterprisePlan?.features.customDomain ?? false,
            },
            {
              name: "Email Support",
              tooltip: "Access to our email support team.",
              free: freePlan?.features.emailSupport ?? false,
              basic: basicPlan?.features.emailSupport ?? false,
              pro: proPlan?.features.emailSupport ?? false,
              enterprise: enterprisePlan?.features.emailSupport ?? false,
            },
            {
              name: "Priority Support",
              tooltip: "Get faster response times from our support team.",
              free: freePlan?.features.prioritySupport ?? false,
              basic: basicPlan?.features.prioritySupport ?? false,
              pro: proPlan?.features.prioritySupport ?? false,
              enterprise: enterprisePlan?.features.prioritySupport ?? false,
            },
            {
              name: "Dedicated Account Manager",
              tooltip: "A dedicated manager to help you with your account.",
              free: freePlan?.features.dedicatedAccountManager ?? false,
              basic: basicPlan?.features.dedicatedAccountManager ?? false,
              pro: proPlan?.features.dedicatedAccountManager ?? false,
              enterprise:
                enterprisePlan?.features.dedicatedAccountManager ?? false,
            },
            {
              name: "Analytics Dashboard",
              tooltip: "Access to different levels of analytics.",
              free: formatValue(freePlan?.features.analyticsDashboard),
              basic: formatValue(basicPlan?.features.analyticsDashboard),
              pro: formatValue(proPlan?.features.analyticsDashboard),
              enterprise: formatValue(
                enterprisePlan?.features.analyticsDashboard
              ),
            },
            {
              name: "Review Filtering",
              tooltip: "Filter reviews based on criteria.",
              free: freePlan?.features.reviewFiltering ?? false,
              basic: basicPlan?.features.reviewFiltering ?? false,
              pro: proPlan?.features.reviewFiltering ?? false,
              enterprise: enterprisePlan?.features.reviewFiltering ?? false,
            },
            {
              name: "Customer Segmentation",
              tooltip: "Segment customers for targeted campaigns.",
              free: freePlan?.features.customerSegmentation ?? false,
              basic: basicPlan?.features.customerSegmentation ?? false,
              pro: proPlan?.features.customerSegmentation ?? false,
              enterprise:
                enterprisePlan?.features.customerSegmentation ?? false,
            },
          ];
          return comparisonFeatures;
        };

        setFeatures(transformPlansToFeatures(fetchedPlans));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlansAndTransform();
  }, [currency]);

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
          <p className="text-sm text-muted-foreground">
            A detailed comparison of Reebews pricing plans
          </p>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          {isLoading ? (
            <ComparisonSkeleton />
          ) : (
            <TooltipProvider>
              <Table>
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
          )}
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            * All prices are in USD or INR and are subject to change. Terms and
            conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
}
