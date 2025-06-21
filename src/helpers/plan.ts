import { Plan } from "@/enums/checkout.enum";

/**
 * Get plan ID by plan name
 * Maps plan names to their corresponding numeric IDs
 */
export function getPlanIdByName(planName: Plan): number {
  switch (planName) {
    case Plan.FREE:
      return 0;
    case Plan.BASIC:
      return 1;
    case Plan.PRO:
      return 2;
    case Plan.ENTERPRISE:
      return 3;
    default:
      return 0;
  }
}

/**
 * Get plan name by plan ID
 * Maps numeric plan IDs to their corresponding plan names
 */
export function getPlanNameById(planId: number): Plan {
  switch (planId) {
    case 0:
      return Plan.FREE;
    case 1:
      return Plan.BASIC;
    case 2:
      return Plan.PRO;
    case 3:
      return Plan.ENTERPRISE;
    default:
      return Plan.FREE;
  }
}

/**
 * Check if a plan is free
 */
export function isFreeplan(planName: Plan): boolean {
  return planName === Plan.FREE;
}

/**
 * Check if a plan requires payment
 */
export function isPaidPlan(planName: Plan): boolean {
  return planName !== Plan.FREE;
}
