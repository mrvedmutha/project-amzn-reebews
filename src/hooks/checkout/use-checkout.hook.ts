import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCurrency } from "@/components/currency-toggle";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { Plan, Currency, BillingCycle, CouponType, PaymentMethod } from "@/enums/checkout.enum";
import { CheckoutFormZod } from "@/schemas/zod/checkout/checkout.zod";
import type { CheckoutFormValues, PlanDetails, CouponDetails } from "@/types/checkout.types";

export function useCheckout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { country: geoCountry, loading: geoLoading } = useGeoLocation();

  // Form state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>(BillingCycle.MONTHLY);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponType, setCouponType] = React.useState<CouponType>(CouponType.PERCENTAGE);
  const [couponDetails, setCouponDetails] = React.useState<CouponDetails | null>(null);

  const plan = searchParams.get("plan") || "basic";

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormZod) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      gstNumber: "",
      paymentMethod: "card",
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
      agreeToTerms: false,
    },
  });

  // Set billing cycle from URL parameter
  React.useEffect(() => {
    const billingParam = searchParams.get("billing");
    if (plan !== Plan.FREE && (billingParam === BillingCycle.YEARLY || billingParam === BillingCycle.MONTHLY)) {
      setBillingCycle(billingParam as BillingCycle);
    }
  }, [searchParams, plan]);

  // Set country from geolocation
  React.useEffect(() => {
    if (!geoLoading && geoCountry && !selectedCountry) {
      setSelectedCountry(geoCountry);
      form.setValue("country", geoCountry);
      setCurrency(geoCountry === "India" ? Currency.INR : Currency.USD);
    }
  }, [geoLoading, geoCountry, selectedCountry, setCurrency, form]);

  // Update currency when country changes
  React.useEffect(() => {
    if (selectedCountry === "India") {
      setCurrency(Currency.INR);
    } else if (selectedCountry) {
      setCurrency(Currency.USD);
    }
  }, [selectedCountry, setCurrency]);

  // Update payment method based on country
  React.useEffect(() => {
    if (selectedCountry === "India") {
      if (!form.getValues("paymentMethod")) {
        form.setValue("paymentMethod", "card");
      }
    } else {
      form.setValue("paymentMethod", "card");
    }
  }, [selectedCountry, form]);

  // Get plan details
  const getPlanDetails = (): PlanDetails => {
    switch (plan) {
      case "free":
        return {
          name: "Free Plan",
          price: { USD: 0.0, INR: 0.0 },
          description: "Get started with the basics",
          features: [
            "3 Products",
            "1 Campaign",
            "1 Promotion",
            "1 Marketplace",
            "10 Reviews per month",
            "Reebews branding",
            `Additional products at ${currency === Currency.USD ? "$8.00" : "₹125.00"} per product`,
          ],
          upgrades: [Plan.BASIC, Plan.PRO],
          billingCycle,
        };
      case "basic":
        const basicPrice = billingCycle === "monthly" 
          ? { USD: 29.0, INR: 499.0 } 
          : { USD: 25.0 * 12, INR: 425.0 * 12 }; // Yearly price is monthly discounted price × 12
        return {
          name: "Basic Plan",
          price: basicPrice,
          description: "Perfect for small sellers",
          features: [
            "5 Products",
            "5 Campaigns",
            "5 Promotions",
            "5 Marketplaces",
            "Unlimited Reviews",
            "No Reebews branding",
            `Additional products at ${currency === "USD" ? "$5.00" : "₹70.00"} per product`,
          ],
          upgrades: [Plan.PRO],
          downgrades: [Plan.FREE],
          billingCycle,
        };
      case "pro":
        const proPrice = billingCycle === "monthly" 
          ? { USD: 49.0, INR: 999.0 } 
          : { USD: 35.0 * 12, INR: 699.0 * 12 }; // Yearly price is monthly discounted price × 12
        return {
          name: "Pro Plan",
          price: proPrice,
          description: "For growing businesses",
          features: [
            "25 Products",
            "25 Campaigns",
            "Unlimited Promotions",
            "10 Marketplaces",
            "Unlimited Reviews",
            "No Reebews branding",
            `Additional products at ${currency === "USD" ? "$3.00" : "₹50.00"} per product`,
          ],
          downgrades: [Plan.BASIC],
          billingCycle,
        };
      default:
        const defaultPrice = billingCycle === BillingCycle.MONTHLY 
          ? { USD: 29.0, INR: 499.0 } 
          : { USD: 25.0 * 12, INR: 425.0 * 12 }; // Yearly price is monthly discounted price × 12
        return {
          name: "Basic Plan",
          price: defaultPrice,
          description: "Perfect for small sellers",
          features: [
            "5 Products",
            "5 Campaigns",
            "5 Promotions",
            "5 Marketplaces",
            "Unlimited Reviews",
            "No Reebews branding",
            `Additional products at ${currency === "USD" ? "$5.00" : "₹70.00"} per product`,
          ],
          upgrades: [Plan.PRO],
          downgrades: [Plan.FREE],
          billingCycle,
        };
    }
  };

  const planDetails = getPlanDetails();

  // Apply coupon logic
  const applyCoupon = () => {
    setCouponError("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponDetails(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const validCoupons: Record<string, { discountValue: number; type: CouponType; description: string; }> = {
      NEW10: { discountValue: 10, type: CouponType.PERCENTAGE, description: "10% off for new customers" },
      WELCOME20: { discountValue: 20, type: CouponType.PERCENTAGE, description: "20% off welcome offer" },
      FLAT50: { discountValue: 50, type: CouponType.AMOUNT, description: `Flat ${currency === "USD" ? "$50.00" : "₹50.00"} off` },
      SPECIAL30: { discountValue: 30, type: CouponType.PERCENTAGE, description: "30% off special discount" },
    };

    const upperCoupon = couponCode.toUpperCase();
    if (validCoupons[upperCoupon]) {
      const coupon = validCoupons[upperCoupon];
      setCouponDiscount(coupon.discountValue);
      setCouponType(coupon.type);
      setCouponApplied(true);
      setCouponDetails({
        code: upperCoupon,
        discountValue: coupon.discountValue,
        type: coupon.type,
        description: coupon.description,
      });
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    const basePrice = planDetails.price;
    if (!couponApplied) return basePrice;

    if (couponType === "percentage") {
      const discountMultiplier = (100 - couponDiscount) / 100;
      return {
        USD: parseFloat((basePrice.USD * discountMultiplier).toFixed(2)),
        INR: parseFloat((basePrice.INR * discountMultiplier).toFixed(2)),
      };
    } else {
      return {
        USD: parseFloat(Math.max(0, basePrice.USD - couponDiscount).toFixed(2)),
        INR: parseFloat(Math.max(0, basePrice.INR - couponDiscount * (currency === "USD" ? 15 : 1)).toFixed(2)),
      };
    }
  };

  // Get original price for comparison
  const getOriginalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };
    
    // For yearly billing, return the original monthly price * 12 (before yearly discount)
    if (billingCycle === "yearly") {
      switch (plan) {
        case "basic": return { USD: 29.0 * 12, INR: 499.0 * 12 }; // Monthly price * 12
        case "pro": return { USD: 49.0 * 12, INR: 999.0 * 12 }; // Monthly price * 12
        default: return { USD: 29.0 * 12, INR: 499.0 * 12 };
      }
    }
    
    // For monthly billing, return current monthly prices
    switch (plan) {
      case "basic": return { USD: 29.0, INR: 499.0 };
      case "pro": return { USD: 49.0, INR: 999.0 };
      default: return { USD: 29.0, INR: 499.0 };
    }
  };

  // Calculate discount amount - this should show the difference between original price and final price
  const calculateDiscountAmount = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };
    
    // For yearly billing, calculate discount from monthly * 12 vs yearly price
    if (billingCycle === "yearly" && !couponApplied) {
      const monthlyPrice = plan === "basic" 
        ? { USD: 29.0, INR: 499.0 } 
        : plan === "pro" 
        ? { USD: 49.0, INR: 999.0 } 
        : { USD: 29.0, INR: 499.0 };
      
      const yearlyFullPrice = { USD: monthlyPrice.USD * 12, INR: monthlyPrice.INR * 12 };
      const yearlyDiscountedPrice = planDetails.price;
      
      return {
        USD: parseFloat((yearlyFullPrice.USD - yearlyDiscountedPrice.USD).toFixed(2)),
        INR: parseFloat((yearlyFullPrice.INR - yearlyDiscountedPrice.INR).toFixed(2)),
      };
    }
    
    // For coupon discounts or monthly billing
    const basePrice = billingCycle === "yearly" ? getOriginalPrice() : planDetails.price;
    const finalPrice = calculateFinalPrice();
    return {
      USD: parseFloat((basePrice.USD - finalPrice.USD).toFixed(2)),
      INR: parseFloat((basePrice.INR - finalPrice.INR).toFixed(2)),
    };
  };

  // Format price
  const formatPrice = (price: number) => price.toFixed(2);

  // Submit handler
  const onSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);

    if (plan === "free") {
      setTimeout(() => {
        router.push(`/checkout/thank-you?plan=${plan}`);
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    setTimeout(() => {
      router.push(`/checkout/thank-you?plan=${plan}&billing=${billingCycle}`);
      setIsSubmitting(false);
    }, 2000);
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDetails(null);
  };

  const finalPrice = calculateFinalPrice();
  const discountAmount = calculateDiscountAmount();
  const showDiscount = billingCycle === "yearly" || couponApplied;
  const originalPrice = getOriginalPrice();
  const isIndianUser = selectedCountry === "India";

  return {
    // Form
    form,
    isSubmitting,
    onSubmit,
    
    // Plan data
    plan,
    planDetails,
    billingCycle,
    setBillingCycle,
    
    // Location & Currency
    selectedCountry,
    setSelectedCountry,
    isIndianUser,
    currency,
    
    // Pricing
    finalPrice,
    originalPrice,
    discountAmount,
    showDiscount,
    formatPrice,
    
    // Coupons
    couponCode,
    setCouponCode,
    couponError,
    couponApplied,
    couponDetails,
    applyCoupon,
    removeCoupon,
  };
} 