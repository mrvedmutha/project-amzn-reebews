import { useState, useEffect } from "react";
import { IPlan } from "@/types/plan/plan.types";

interface UsePlansReturn {
  plans: IPlan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch active plans from the API
 */
export function usePlans(): UsePlansReturn {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/plans/active");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to load plans");
      }

      setPlans(result.data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    isLoading,
    error,
    refetch: fetchPlans,
  };
}
