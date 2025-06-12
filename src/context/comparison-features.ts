import { Feature } from "@/types/comparison.types";

export const getComparisonFeatures = (currency: string): Feature[] => {
  const reviewPrice = currency === "USD" ? "$0.08" : "₹5";
  const basicProductPrice = currency === "USD" ? "$5" : "₹70";
  const proProductPrice = currency === "USD" ? "$3" : "₹50";
  const freeProductPrice = currency === "USD" ? "$8" : "₹125";

  return [
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
}; 