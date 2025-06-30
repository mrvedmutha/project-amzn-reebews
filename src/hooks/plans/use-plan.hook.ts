import { useState, useEffect } from "react";
import { IPlan } from "@/types/plan/plan.types";

interface UsePlanReturn {
  plan: IPlan | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a specific plan by name
 */
export function usePlan(planName: string): UsePlanReturn {
  const [plan, setPlan] = useState<IPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First try to get all active plans and find the specific one
      const response = await fetch("/api/plans/active");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to load plans");
      }

      const foundPlan = result.data.find((p: IPlan) => p.name === planName);

      if (!foundPlan) {
        throw new Error(`Plan '${planName}' not found`);
      }

      setPlan(foundPlan);
    } catch (err) {
      console.error("Error fetching plan:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (planName) {
      fetchPlan();
    }
  }, [planName]);

  return {
    plan,
    isLoading,
    error,
    refetch: fetchPlan,
  };
}
