import { IPlan } from "@/types/plan/plan.types";
import { Feature } from "@/types/comparison.types";
import { PlanDetails } from "@/types/checkout.types";
import { Plan, BillingCycle, Currency } from "@/enums/checkout.enum";

/**
 * Transform API plan data to pricing component format
 */
export function transformToPricingPlan(
  plan: IPlan,
  currency: "USD" | "INR",
  billingCycle: "monthly" | "yearly"
) {
  const additionalProductCost =
    plan.features.additionalProductsCost.additionalProducts;

  return {
    title: plan.displayName.replace(" Plan", ""),
    description: plan.description,
    price: {
      monthly: plan.pricing.monthly,
      yearly: plan.pricing.yearly,
    },
    features: [
      {
        name: `${plan.features.numberOfProducts} Product${plan.features.numberOfProducts !== 1 ? "s" : ""}`,
        included: true,
      },
      {
        name: `${plan.features.numberOfCampaigns} Campaign${plan.features.numberOfCampaigns !== 1 ? "s" : ""}`,
        included: true,
      },
      {
        name: `${plan.features.numberOfPromotions === 1 ? "1 Promotion" : plan.features.numberOfPromotions + " Promotions"}`,
        included: true,
      },
      {
        name: `${plan.features.marketplaces} Marketplace${plan.features.marketplaces !== 1 ? "s" : ""}`,
        included: true,
      },
      {
        name:
          plan.features.monthlyReviews === "unlimited"
            ? "Unlimited Reviews"
            : `${plan.features.monthlyReviews} Reviews per month`,
        included: true,
      },
      {
        name: plan.features.whiteLabel
          ? "No Reebews branding"
          : "Reebews branding",
        included: true,
      },
      {
        name: `Additional products at ${
          currency === "USD"
            ? `$${additionalProductCost.USD}`
            : `₹${additionalProductCost.INR}`
        } per product`,
        included: true,
      },
    ],
    isMostPopular: plan.name === "basic",
    ctaText:
      plan.name === "free"
        ? "Get Started"
        : `Choose ${plan.displayName.replace(" Plan", "")}`,
    ctaLink:
      plan.name === "free"
        ? `/checkout?plan=${plan.name}`
        : `/checkout?plan=${plan.name}&billing=${billingCycle}`,
  };
}

/**
 * Transform API plan data to checkout plan details format
 */
export function transformToCheckoutPlanDetails(
  plan: IPlan,
  currency: Currency,
  billingCycle: BillingCycle
): PlanDetails {
  const additionalProductCost =
    plan.features.additionalProductsCost.additionalProducts;

  // Calculate price based on billing cycle
  const price =
    billingCycle === BillingCycle.MONTHLY
      ? plan.pricing.monthly
      : plan.pricing.yearly;

  // Create features list
  const features = [
    `${plan.features.numberOfProducts} Product${plan.features.numberOfProducts !== 1 ? "s" : ""}`,
    `${plan.features.numberOfCampaigns} Campaign${plan.features.numberOfCampaigns !== 1 ? "s" : ""}`,
    plan.features.numberOfPromotions === 1
      ? "1 Promotion"
      : `${plan.features.numberOfPromotions} Promotions`,
    `${plan.features.marketplaces} Marketplace${plan.features.marketplaces !== 1 ? "s" : ""}`,
    plan.features.monthlyReviews === "unlimited"
      ? "Unlimited Reviews"
      : `${plan.features.monthlyReviews} Reviews per month`,
    plan.features.whiteLabel ? "No Reebews branding" : "Reebews branding",
    `Additional products at ${
      currency === Currency.USD
        ? `$${additionalProductCost.USD}.00`
        : `₹${additionalProductCost.INR}.00`
    } per product`,
  ];

  // Determine upgrades and downgrades based on plan
  let upgrades: Plan[] = [];
  let downgrades: Plan[] = [];

  switch (plan.name) {
    case "free":
      upgrades = [Plan.BASIC, Plan.PRO];
      break;
    case "basic":
      upgrades = [Plan.PRO];
      downgrades = [Plan.FREE];
      break;
    case "pro":
      downgrades = [Plan.BASIC];
      break;
  }

  return {
    name: plan.displayName,
    price,
    description: plan.description,
    features,
    upgrades,
    downgrades,
    billingCycle,
  };
}

/**
 * Transform API plan data to comparison features
 */
export function transformToComparisonFeatures(
  plans: IPlan[],
  currency: "USD" | "INR"
): Feature[] {
  // Find plans by name for easy access
  const freePlan = plans.find((p) => p.name === "free");
  const basicPlan = plans.find((p) => p.name === "basic");
  const proPlan = plans.find((p) => p.name === "pro");

  const getFeatureValue = (
    plan: IPlan | undefined,
    field: keyof IPlan["features"]
  ) => {
    if (!plan) return "N/A";
    const value = plan.features[field];
    if (typeof value === "boolean") return value;
    if (value === "unlimited") return "Unlimited";
    return value.toString();
  };

  const getAdditionalCost = (
    plan: IPlan | undefined,
    type: "additionalReviews" | "additionalProducts"
  ) => {
    if (!plan) return false;
    if (type === "additionalReviews") {
      if (!plan.features.additionalReviewsCost) return false;
      const cost = plan.features.additionalProductsCost.additionalReviews;
      return currency === "USD" ? `$${cost.USD}/review` : `₹${cost.INR}/review`;
    } else {
      const cost = plan.features.additionalProductsCost.additionalProducts;
      return currency === "USD"
        ? `$${cost.USD}/product`
        : `₹${cost.INR}/product`;
    }
  };

  return [
    {
      name: "Number of Products",
      free: getFeatureValue(freePlan, "numberOfProducts"),
      basic: getFeatureValue(basicPlan, "numberOfProducts"),
      pro: getFeatureValue(proPlan, "numberOfProducts"),
      enterprise: "Unlimited",
    },
    {
      name: "Number of Campaigns",
      free: getFeatureValue(freePlan, "numberOfCampaigns"),
      basic: getFeatureValue(basicPlan, "numberOfCampaigns"),
      pro: getFeatureValue(proPlan, "numberOfCampaigns"),
      enterprise: "Unlimited",
      tooltip:
        "Campaigns allow you to organize and track different review collection strategies",
    },
    {
      name: "Number of Promotions",
      free: getFeatureValue(freePlan, "numberOfPromotions"),
      basic: getFeatureValue(basicPlan, "numberOfPromotions"),
      pro:
        proPlan?.features.numberOfPromotions === 25
          ? "Unlimited"
          : getFeatureValue(proPlan, "numberOfPromotions"),
      enterprise: "Unlimited",
      tooltip:
        "Promotions are the incentives you offer to customers in exchange for reviews",
    },
    {
      name: "Marketplaces",
      free: getFeatureValue(freePlan, "marketplaces"),
      basic: getFeatureValue(basicPlan, "marketplaces"),
      pro: getFeatureValue(proPlan, "marketplaces"),
      enterprise: "All",
      tooltip:
        "Amazon marketplaces you can collect reviews for (US, UK, EU, India, etc.)",
    },
    {
      name: "Monthly Reviews",
      free: getFeatureValue(freePlan, "monthlyReviews"),
      basic: getFeatureValue(basicPlan, "monthlyReviews"),
      pro: getFeatureValue(proPlan, "monthlyReviews"),
      enterprise: "Unlimited",
    },
    {
      name: "Additional Reviews Cost",
      free: getAdditionalCost(freePlan, "additionalReviews"),
      basic: getAdditionalCost(basicPlan, "additionalReviews"),
      pro: getAdditionalCost(proPlan, "additionalReviews"),
      enterprise: false,
    },
    {
      name: "Additional Products",
      free: getAdditionalCost(freePlan, "additionalProducts"),
      basic: getAdditionalCost(basicPlan, "additionalProducts"),
      pro: getAdditionalCost(proPlan, "additionalProducts"),
      enterprise: false,
      tooltip: "Cost to add more products beyond your plan's included amount",
    },
    {
      name: "White Labeling",
      free: getFeatureValue(freePlan, "whiteLabel") === true,
      basic: getFeatureValue(basicPlan, "whiteLabel") === true,
      pro: getFeatureValue(proPlan, "whiteLabel") === true,
      enterprise: true,
      tooltip: "Remove Reebews branding from customer-facing content",
    },
    {
      name: "Custom Domain",
      free: getFeatureValue(freePlan, "customDomain") === true,
      basic: getFeatureValue(basicPlan, "customDomain") === true,
      pro: getFeatureValue(proPlan, "customDomain") === true,
      enterprise: true,
      tooltip: "Use your own custom domain for your review pages",
    },
    {
      name: "Email Support",
      free: getFeatureValue(freePlan, "emailSupport") === true,
      basic: getFeatureValue(basicPlan, "emailSupport") === true,
      pro: getFeatureValue(proPlan, "emailSupport") === true,
      enterprise: true,
    },
    {
      name: "Priority Support",
      free: getFeatureValue(freePlan, "prioritySupport") === true,
      basic: getFeatureValue(basicPlan, "prioritySupport") === true,
      pro: getFeatureValue(proPlan, "prioritySupport") === true,
      enterprise: true,
    },
    {
      name: "Dedicated Account Manager",
      free: getFeatureValue(freePlan, "dedicatedAccountManager") === true,
      basic: getFeatureValue(basicPlan, "dedicatedAccountManager") === true,
      pro: getFeatureValue(proPlan, "dedicatedAccountManager") === true,
      enterprise: true,
    },
    {
      name: "Analytics Dashboard",
      free:
        freePlan?.features.analyticsDashboard === "basic"
          ? "Basic"
          : "Advanced",
      basic:
        basicPlan?.features.analyticsDashboard === "basic"
          ? "Basic"
          : "Advanced",
      pro:
        proPlan?.features.analyticsDashboard === "basic" ? "Basic" : "Advanced",
      enterprise: "Custom",
    },
    {
      name: "Review Filtering",
      free: getFeatureValue(freePlan, "reviewFiltering") === true,
      basic: getFeatureValue(basicPlan, "reviewFiltering") === true,
      pro: getFeatureValue(proPlan, "reviewFiltering") === true,
      enterprise: true,
      tooltip: "Filter out negative reviews before they appear on Amazon",
    },
    {
      name: "Customer Segmentation",
      free: getFeatureValue(freePlan, "customerSegmentation") === true,
      basic: getFeatureValue(basicPlan, "customerSegmentation") === true,
      pro: getFeatureValue(proPlan, "customerSegmentation") === true,
      enterprise: true,
      tooltip: "Target specific customer groups with tailored campaigns",
    },
  ];
}
