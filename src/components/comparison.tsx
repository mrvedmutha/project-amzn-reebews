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
import { Feature } from "@/types/comparison.types";
import { usePlans } from "@/hooks/plans/use-plans.hook";
import { transformToComparisonFeatures } from "@/utils/plan-helpers";
import { ComparisonSkeleton } from "@/components/skeletons/comparison-skeleton";

export function Comparison() {
  const { currency } = useCurrency();
  const { plans, isLoading, error } = usePlans();

  // Transform API plans to comparison features
  const features = React.useMemo(() => {
    if (!plans || plans.length === 0) return [];
    return transformToComparisonFeatures(plans, currency);
  }, [plans, currency]);

  // Show loading skeleton while fetching plans
  if (isLoading) {
    return <ComparisonSkeleton />;
  }

  // Show error message if API fails
  if (error) {
    return (
      <div id="comparison" className="w-full py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-yellow-500">Feature</span> Comparison
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-red-700">Failed to load comparison data</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
