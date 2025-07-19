import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCurrency } from "@/components/currency-toggle";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import {
  Plan,
  Currency,
  BillingCycle,
  CouponType,
  PaymentStatus,
} from "@/enums/checkout.enum";
import { CheckoutFormZod } from "@/schemas/zod/checkout/checkout.zod";
import type {
  CheckoutFormValues,
  PlanDetails,
  CouponDetails,
} from "@/types/checkout.types";
import { ICart } from "@/types/cart/cart.types";

export function useCheckout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { country: geoCountry, loading: geoLoading } = useGeoLocation();

  // Form state
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>(
    BillingCycle.MONTHLY
  );

  // Cart resumption state
  const [existingCart, setExistingCart] = React.useState<ICart | null>(null);
  const [isCartLoading, setIsCartLoading] = React.useState(false);
  const [cartLoadError, setCartLoadError] = React.useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponType, setCouponType] = React.useState<CouponType>(
    CouponType.PERCENTAGE
  );
  const [couponDetails, setCouponDetails] =
    React.useState<CouponDetails | null>(null);

  const plan =
    searchParams.get("plan") ||
    (existingCart?.subscription.plan &&
    typeof existingCart.subscription.plan === "object" &&
    "name" in existingCart.subscription.plan
      ? (existingCart.subscription.plan as { name: string }).name
      : undefined) ||
    "basic";
  const cartId = searchParams.get("cartid");
  const paymentError = searchParams.get("error");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormZod) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
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

  // Load existing cart if cartId is provided
  React.useEffect(() => {
    const loadExistingCart = async () => {
      if (!cartId) return;

      setIsCartLoading(true);
      setCartLoadError(null);

      try {
        const response = await fetch(`/api/cart/load?cartId=${cartId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setCartLoadError("Cart not found. Please start a new checkout.");
          } else {
            setCartLoadError("Failed to load cart. Please try again.");
          }
          return;
        }

        const { cart } = await response.json();

        // Only allow resumption for pending/failed payments
        if (cart.payment.status === PaymentStatus.COMPLETED) {
          setCartLoadError("This order has already been completed.");
          return;
        }

        setExistingCart(cart);

        // Pre-populate form with existing cart data
        // Handle both older carts with `name` field and newer carts with `firstName`/`lastName` fields
        const firstNameFromCart = (cart.user as any).firstName || "";
        const lastNameFromCart = (cart.user as any).lastName || "";

        if (firstNameFromCart || lastNameFromCart) {
          form.setValue("firstName", firstNameFromCart);
          form.setValue("lastName", lastNameFromCart);
        } else if (cart.user.name) {
          const nameParts = cart.user.name.split(" ");
          form.setValue("firstName", nameParts[0] || "");
          form.setValue("lastName", nameParts.slice(1).join(" ") || "");
        }
        form.setValue("email", cart.user.email);
        form.setValue("companyName", cart.user.business?.company || "");
        form.setValue("gstNumber", cart.user.business?.gstin || "");
        form.setValue("address.street", cart.user.address.street);
        form.setValue("address.city", cart.user.address.city);
        form.setValue("address.state", cart.user.address.state);
        form.setValue("address.country", cart.user.address.country);
        form.setValue("address.pincode", cart.user.address.pincode);

        // Set billing cycle and country from cart
        setBillingCycle(cart.billingCycle);
        setSelectedCountry(cart.user.address.country);
        setCurrency(cart.payment.currency);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCartLoadError("Failed to load cart. Please try again.");
      } finally {
        setIsCartLoading(false);
      }
    };

    loadExistingCart();
  }, [cartId, form]);

  // Set billing cycle from URL parameter (only for new checkouts)
  React.useEffect(() => {
    if (!existingCart) {
      const billingParam = searchParams.get("billing");
      if (
        plan !== Plan.FREE &&
        (billingParam === BillingCycle.YEARLY ||
          billingParam === BillingCycle.MONTHLY)
      ) {
        setBillingCycle(billingParam as BillingCycle);
      }
    }
  }, [searchParams, plan, existingCart]);

  // Set country from geolocation (only for new checkouts)
  React.useEffect(() => {
    if (!geoLoading && geoCountry && !selectedCountry && !existingCart) {
      setSelectedCountry(geoCountry);
      form.setValue("address.country", geoCountry);
      setCurrency(geoCountry === "India" ? Currency.INR : Currency.USD);
    }
  }, [
    geoLoading,
    geoCountry,
    selectedCountry,
    setCurrency,
    form,
    existingCart,
  ]);

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
    }
    // For non-Indian users, payment method is handled automatically (PayPal redirect)
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
            `Additional products at ${
              currency === Currency.USD ? "$8.00" : "₹125.00"
            } per product`,
          ],
          upgrades: [Plan.BASIC, Plan.PRO],
          billingCycle,
        };
      case "basic":
        const basicPrice =
          billingCycle === "monthly"
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
            `Additional products at ${
              currency === "USD" ? "$5.00" : "₹70.00"
            } per product`,
          ],
          upgrades: [Plan.PRO],
          downgrades: [Plan.FREE],
          billingCycle,
        };
      case "pro":
        const proPrice =
          billingCycle === "monthly"
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
            `Additional products at ${
              currency === "USD" ? "$3.00" : "₹50.00"
            } per product`,
          ],
          downgrades: [Plan.BASIC],
          billingCycle,
        };
      default:
        const defaultPrice =
          billingCycle === BillingCycle.MONTHLY
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
            `Additional products at ${
              currency === "USD" ? "$5.00" : "₹70.00"
            } per product`,
          ],
          upgrades: [Plan.PRO],
          downgrades: [Plan.FREE],
          billingCycle,
        };
    }
  };

  const planDetails = getPlanDetails();

  // Apply coupon logic
  const applyCoupon = async () => {
    setCouponError("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponDetails(null);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setCouponError(data.error || "Invalid coupon code");
        return;
      }
      const coupon = data.coupon;
      setCouponDiscount(coupon.discountValue);
      setCouponType(coupon.type);
      setCouponApplied(true);
      setCouponDetails({
        code: coupon.code,
        discountValue: coupon.discountValue,
        type: coupon.type,
        description: coupon.description,
      });
    } catch (error: any) {
      setCouponError("Failed to validate coupon. Please try again.");
    }
  };

  // Calculate final price
  const calculateFinalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    // Use cart's stored pricing if available, otherwise use planDetails
    let basePrice: { USD: number; INR: number };
    
    if (existingCart && existingCart.payment?.totalAmount !== undefined) {
      // Use the actual payment amount (what user is paying) when resuming
      const paymentAmount = existingCart.payment.totalAmount;
      const paymentCurrency = existingCart.payment.currency;
      
      // Create base price object using the payment amount and currency
      basePrice = {
        USD: paymentCurrency === "USD" ? paymentAmount : 0,
        INR: paymentCurrency === "INR" ? paymentAmount : 0,
      };
    } else {
      basePrice = planDetails.price;
    }

    let result: { USD: number; INR: number };
    if (!couponApplied) {
      result = basePrice;
    } else if (couponType === "percentage") {
      const discountMultiplier = (100 - couponDiscount) / 100;
      result = {
        USD: basePrice.USD * discountMultiplier,
        INR: basePrice.INR * discountMultiplier,
      };
    } else {
      result = {
        USD: Math.max(0, basePrice.USD - couponDiscount),
        INR: Math.max(
          0,
          basePrice.INR - couponDiscount * (currency === "USD" ? 15 : 1)
        ),
      };
    }
    // Simple rounding to nearest integer
    return {
      USD: Math.round(result.USD),
      INR: Math.round(result.INR),
    };
  };

  // Get original price for comparison
  const getOriginalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    // If we have an existing cart, use subscription amount as the original price
    if (existingCart && existingCart.subscription?.planAmount !== undefined) {
      const subscriptionAmount = existingCart.subscription.planAmount;
      const subscriptionCurrency = existingCart.subscription.planCurrency;
      
      return {
        USD: subscriptionCurrency === "USD" ? subscriptionAmount : 0,
        INR: subscriptionCurrency === "INR" ? subscriptionAmount : 0,
      };
    }

    // For yearly billing, return the original monthly price * 12 (before yearly discount)
    if (billingCycle === "yearly") {
      switch (plan) {
        case "basic":
          return { USD: 29.0 * 12, INR: 499.0 * 12 }; // Monthly price * 12
        case "pro":
          return { USD: 49.0 * 12, INR: 999.0 * 12 }; // Monthly price * 12
        default:
          return { USD: 29.0 * 12, INR: 499.0 * 12 };
      }
    }

    // For monthly billing, return current monthly prices
    switch (plan) {
      case "basic":
        return { USD: 29.0, INR: 499.0 };
      case "pro":
        return { USD: 49.0, INR: 999.0 };
      default:
        return { USD: 29.0, INR: 499.0 };
    }
  };

  // Calculate discount amount - this should show the difference between original price and final price
  const calculateDiscountAmount = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    // For existing carts, calculate discount from subscription amount vs payment amount
    if (existingCart && existingCart.subscription?.planAmount !== existingCart.payment?.totalAmount) {
      const subscriptionAmount = existingCart.subscription.planAmount;
      const paymentAmount = existingCart.payment.totalAmount;
      const currency = existingCart.payment.currency;
      
      const discountAmount = subscriptionAmount - paymentAmount;
      
      return {
        USD: currency === "USD" ? parseFloat(discountAmount.toFixed(2)) : 0,
        INR: currency === "INR" ? parseFloat(discountAmount.toFixed(2)) : 0,
      };
    }

    // For yearly billing, calculate discount from monthly * 12 vs yearly price
    if (billingCycle === "yearly" && !couponApplied) {
      const monthlyPrice =
        plan === "basic"
          ? { USD: 29.0, INR: 499.0 }
          : plan === "pro"
            ? { USD: 49.0, INR: 999.0 }
            : { USD: 29.0, INR: 499.0 };

      const yearlyFullPrice = {
        USD: monthlyPrice.USD * 12,
        INR: monthlyPrice.INR * 12,
      };
      const yearlyDiscountedPrice = planDetails.price;

      return {
        USD: parseFloat(
          (yearlyFullPrice.USD - yearlyDiscountedPrice.USD).toFixed(2)
        ),
        INR: parseFloat(
          (yearlyFullPrice.INR - yearlyDiscountedPrice.INR).toFixed(2)
        ),
      };
    }

    // For coupon discounts or monthly billing
    const basePrice =
      billingCycle === "yearly" ? getOriginalPrice() : planDetails.price;
    const finalPrice = calculateFinalPrice();
    return {
      USD: parseFloat((basePrice.USD - finalPrice.USD).toFixed(2)),
      INR: parseFloat((basePrice.INR - finalPrice.INR).toFixed(2)),
    };
  };

  // Format price
  const formatPrice = (price: number) => price.toFixed(2);

  // Submit handler
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);

      if (plan === "free") {
        // For free plans, we might still want to create a cart record
        const result = await handleCheckout(data);
        router.push(`/checkout/thank-you?plan=${plan}&cartId=${result.cartId}`);
        return;
      }

      // Create cart and handle payment flow
      const result = await handleCheckout(data);

      // Redirect to payment processing or thank you page
      router.push(
        `/checkout/thank-you?plan=${plan}&billing=${billingCycle}&cartId=${result.cartId}&paymentId=${result.paymentId}`
      );
    } catch (error) {
      console.error("Checkout submission error:", error);
      // Handle error state here - you might want to show a toast or error message
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponDetails(null);
  };

  const finalPrice = calculateFinalPrice();
  const discountAmount = calculateDiscountAmount();
  const showDiscount = billingCycle === "yearly" || couponApplied || 
    !!(existingCart && existingCart.subscription?.planAmount !== existingCart.payment?.totalAmount);
  const originalPrice = getOriginalPrice();
  const isIndianUser = selectedCountry === "India";

  // Add a handleCheckout function for cart creation
  const handleCheckout = async (formData: CheckoutFormValues) => {
    try {
      setIsSubmitting(true);
      const isIndianUser = selectedCountry === "India";
      const currency = isIndianUser ? "INR" : "USD";
      const amount = isIndianUser ? finalPrice.INR : finalPrice.USD;

      // Map form data to new cart structure
      const userDetails = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state || "",
          country: formData.address.country,
          pincode: formData.address.pincode,
        },
        company: formData.companyName,
        gstNumber: formData.gstNumber,
      };

      const response = await fetch("/api/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          currency,
          amount,
          userDetails,
          paymentGateway: plan === "free" 
            ? (isIndianUser ? "free-india" : "free-us")
            : (isIndianUser ? "razorpay" : "paypal"),
          billingCycle,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create cart");
      }
      const { cartId, paymentId, signupToken } = await response.json();

      return {
        cartId,
        paymentId,
        signupToken,
      };
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

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

    // Cart
    handleCheckout,

    // Cart resumption
    existingCart,
    isCartLoading,
    cartLoadError,
    paymentError,
  };
}
