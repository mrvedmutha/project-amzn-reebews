import { BillingCycle } from "@/enums/checkout.enum";

/**
 * Calculate subscription end date based on billing cycle
 */
export const calculateSubscriptionEndDate = (
  startDate: Date,
  billingCycle: BillingCycle
): Date => {
  const endDate = new Date(startDate);

  if (billingCycle === BillingCycle.YEARLY) {
    // Add exactly 365 days for yearly plans
    endDate.setDate(endDate.getDate() + 365);
  } else {
    // Add exactly 30 days for monthly plans
    endDate.setDate(endDate.getDate() + 30);
  }

  return endDate;
};
