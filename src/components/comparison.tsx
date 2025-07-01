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
          const freePlan = findPlan("free")?.features;
          const basicPlan = findPlan("basic")?.features;
          const proPlan = findPlan("pro")?.features;
          const enterprisePlan = findPlan("enterprise")?.features;

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
              free: formatValue(freePlan?.numberOfProducts),
              basic: formatValue(basicPlan?.numberOfProducts),
              pro: formatValue(proPlan?.numberOfProducts),
              enterprise: formatValue(enterprisePlan?.numberOfProducts),
            },
            {
              name: "Number of Campaigns",
              tooltip: "The maximum number of active review campaigns.",
              free: formatValue(freePlan?.numberOfCampaigns),
              basic: formatValue(basicPlan?.numberOfCampaigns),
              pro: formatValue(proPlan?.numberOfCampaigns),
              enterprise: formatValue(enterprisePlan?.numberOfCampaigns),
            },
            {
              name: "Number of Promotions",
              tooltip: "The maximum number of promotions you can run.",
              free: formatValue(freePlan?.numberOfPromotions),
              basic: formatValue(basicPlan?.numberOfPromotions),
              pro: formatValue(proPlan?.numberOfPromotions),
              enterprise: formatValue(enterprisePlan?.numberOfPromotions),
            },
            {
              name: "Marketplaces",
              tooltip: "Number of marketplaces you can connect to.",
              free: formatValue(freePlan?.marketplaces),
              basic: formatValue(basicPlan?.marketplaces),
              pro: formatValue(proPlan?.marketplaces),
              enterprise: formatValue(enterprisePlan?.marketplaces),
            },
            {
              name: "Monthly Reviews",
              tooltip: "The number of reviews you can collect per month.",
              free: formatValue(freePlan?.monthlyReviews),
              basic: formatValue(basicPlan?.monthlyReviews),
              pro: formatValue(proPlan?.monthlyReviews),
              enterprise: formatValue(enterprisePlan?.monthlyReviews),
            },
            {
              name: "Additional Reviews Cost",
              tooltip: "Cost for reviews beyond the monthly limit.",
              free: formatCostWithSuffix(
                freePlan?.additionalProductsCost.additionalReviews,
                "/review"
              ),
              basic: formatCostWithSuffix(
                basicPlan?.additionalProductsCost.additionalReviews,
                "/review"
              ),
              pro: formatCostWithSuffix(
                proPlan?.additionalProductsCost.additionalReviews,
                "/review"
              ),
              enterprise: formatCostWithSuffix(
                enterprisePlan?.additionalProductsCost.additionalReviews,
                "/review"
              ),
            },
            {
              name: "Additional Products",
              tooltip: "Cost for adding products beyond the plan limit.",
              free: formatCostWithSuffix(
                freePlan?.additionalProductsCost.additionalProducts,
                "/product"
              ),
              basic: formatCostWithSuffix(
                basicPlan?.additionalProductsCost.additionalProducts,
                "/product"
              ),
              pro: formatCostWithSuffix(
                proPlan?.additionalProductsCost.additionalProducts,
                "/product"
              ),
              enterprise: formatCostWithSuffix(
                enterprisePlan?.additionalProductsCost.additionalProducts,
                "/product"
              ),
            },
            {
              name: "White Labeling",
              tooltip: "Remove Reebews branding from your communications.",
              free: freePlan?.whiteLabel ?? false,
              basic: basicPlan?.whiteLabel ?? false,
              pro: proPlan?.whiteLabel ?? false,
              enterprise: enterprisePlan?.whiteLabel ?? false,
            },
            {
              name: "Custom Domain",
              tooltip: "Use your own domain for review collection pages.",
              free: freePlan?.customDomain ?? false,
              basic: basicPlan?.customDomain ?? false,
              pro: proPlan?.customDomain ?? false,
              enterprise: enterprisePlan?.customDomain ?? false,
            },
            {
              name: "Email Support",
              tooltip: "Access to our email support team.",
              free: freePlan?.emailSupport ?? false,
              basic: basicPlan?.emailSupport ?? false,
              pro: proPlan?.emailSupport ?? false,
              enterprise: enterprisePlan?.emailSupport ?? false,
            },
            {
              name: "Priority Support",
              tooltip: "Get faster response times from our support team.",
              free: freePlan?.prioritySupport ?? false,
              basic: basicPlan?.prioritySupport ?? false,
              pro: proPlan?.prioritySupport ?? false,
              enterprise: enterprisePlan?.prioritySupport ?? false,
            },
            {
              name: "Dedicated Account Manager",
              tooltip: "A dedicated manager to help you with your account.",
              free: freePlan?.dedicatedAccountManager ?? false,
              basic: basicPlan?.dedicatedAccountManager ?? false,
              pro: proPlan?.dedicatedAccountManager ?? false,
              enterprise: enterprisePlan?.dedicatedAccountManager ?? false,
            },
            {
              name: "Analytics Dashboard",
              tooltip: "Access to different levels of analytics.",
              free: formatValue(freePlan?.analyticsDashboard),
              basic: formatValue(basicPlan?.analyticsDashboard),
              pro: formatValue(proPlan?.analyticsDashboard),
              enterprise: formatValue(enterprisePlan?.analyticsDashboard),
            },
            {
              name: "Review Filtering",
              tooltip: "Filter reviews based on criteria.",
              free: freePlan?.reviewFiltering ?? false,
              basic: basicPlan?.reviewFiltering ?? false,
              pro: proPlan?.reviewFiltering ?? false,
              enterprise: enterprisePlan?.reviewFiltering ?? false,
            },
            {
              name: "Customer Segmentation",
              tooltip: "Segment customers for targeted campaigns.",
              free: freePlan?.customerSegmentation ?? false,
              basic: basicPlan?.customerSegmentation ?? false,
              pro: proPlan?.customerSegmentation ?? false,
              enterprise: enterprisePlan?.customerSegmentation ?? false,
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
