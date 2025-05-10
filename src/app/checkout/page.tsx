"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, CreditCard, Lock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "@/components/currency-toggle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { CheckoutSkeleton } from "@/components/checkout-skeleton";

// Define form schema with all fields
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyName: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(1, "Please select a country"),
  gstNumber: z.string().optional(),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvc: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Create a component that uses useSearchParams
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { country: geoCountry, loading: geoLoading } = useGeoLocation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  );
  const [couponCode, setCouponCode] = React.useState("");
  const [couponDiscount, setCouponDiscount] = React.useState(0);
  const [couponError, setCouponError] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);
  const [couponType, setCouponType] = React.useState<"percentage" | "amount">(
    "percentage"
  );
  const [couponDetails, setCouponDetails] = React.useState<{
    code: string;
    discountValue: number;
    type: "percentage" | "amount";
    description: string;
  } | null>(null);

  const plan = searchParams.get("plan") || "basic";

  // Set billing cycle from URL parameter
  React.useEffect(() => {
    const billingParam = searchParams.get("billing");
    // Don't apply billing cycle to free tier
    if (
      plan !== "free" &&
      (billingParam === "yearly" || billingParam === "monthly")
    ) {
      setBillingCycle(billingParam);
    }
  }, [searchParams, plan]);

  // Define plan pricing based on the selected plan and currency
  const getPlanDetails = () => {
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
              currency === "USD" ? "$8.00" : "₹125.00"
            } per product`,
          ],
          upgrades: ["basic", "pro"],
          billingCycle,
        };
      case "basic":
        const basicPrice =
          billingCycle === "monthly"
            ? { USD: 29.0, INR: 499.0 }
            : { USD: 25.0, INR: 425.0 };
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
          upgrades: ["pro"],
          downgrades: ["free"],
          billingCycle,
        };
      case "pro":
        const proPrice =
          billingCycle === "monthly"
            ? { USD: 49.0, INR: 999.0 }
            : { USD: 35.0, INR: 699.0 };
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
          downgrades: ["basic"],
          billingCycle,
        };
      default:
        const defaultPrice =
          billingCycle === "monthly"
            ? { USD: 29.0, INR: 499.0 }
            : { USD: 25.0, INR: 425.0 };
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
          upgrades: ["pro"],
          downgrades: ["free"],
          billingCycle,
        };
    }
  };

  const planDetails = getPlanDetails();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema) as any,
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

  // Set country from geolocation once it loads
  React.useEffect(() => {
    if (!geoLoading && geoCountry && !selectedCountry) {
      setSelectedCountry(geoCountry);
      form.setValue("country", geoCountry);

      // Update currency based on country detection
      if (geoCountry === "India") {
        setCurrency("INR");
      } else {
        setCurrency("USD");
      }
    }
  }, [geoLoading, geoCountry, selectedCountry, setCurrency, form]);

  // Update currency when country is manually changed
  React.useEffect(() => {
    if (selectedCountry === "India") {
      setCurrency("INR");
    } else if (selectedCountry) {
      setCurrency("USD");
    }
  }, [selectedCountry, setCurrency]);

  React.useEffect(() => {
    if (selectedCountry === "India") {
      // Don't automatically switch to UPI anymore
      // Allow users to select their preferred payment method
      if (!form.getValues("paymentMethod")) {
        form.setValue("paymentMethod", "card");
      }
    } else {
      form.setValue("paymentMethod", "card");
    }
  }, [selectedCountry, form]);

  // Function to apply coupon code
  const applyCoupon = () => {
    setCouponError("");
    // Reset any previously applied discount
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponDetails(null);

    // Simple coupon validation - in a real app you'd verify with backend
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Example coupon codes - in a real app these would be validated on the server
    const validCoupons: Record<
      string,
      {
        discountValue: number;
        type: "percentage" | "amount";
        description: string;
      }
    > = {
      NEW10: {
        discountValue: 10,
        type: "percentage",
        description: "10% off for new customers",
      },
      WELCOME20: {
        discountValue: 20,
        type: "percentage",
        description: "20% off welcome offer",
      },
      FLAT50: {
        discountValue: 50,
        type: "amount",
        description: `Flat ${currency === "USD" ? "$50.00" : "₹50.00"} off`,
      },
      SPECIAL30: {
        discountValue: 30,
        type: "percentage",
        description: "30% off special discount",
      },
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

  // Calculate final price with discounts
  const calculateFinalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    const basePrice = planDetails.price;

    // If no coupon, return the base price for the selected billing cycle
    if (!couponApplied) return basePrice;

    if (couponType === "percentage") {
      // Calculate percentage discount
      const discountMultiplier = (100 - couponDiscount) / 100;
      return {
        USD: parseFloat((basePrice.USD * discountMultiplier).toFixed(2)),
        INR: parseFloat((basePrice.INR * discountMultiplier).toFixed(2)),
      };
    } else {
      // Apply flat amount discount
      // Don't let the price go below zero
      return {
        USD: parseFloat(Math.max(0, basePrice.USD - couponDiscount).toFixed(2)),
        INR: parseFloat(
          Math.max(
            0,
            basePrice.INR - couponDiscount * (currency === "USD" ? 15 : 1)
          ).toFixed(2)
        ),
      };
    }
  };

  // Calculate the discount amount (how much is saved)
  const calculateDiscountAmount = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    const basePrice = planDetails.price;
    const finalPrice = calculateFinalPrice();

    return {
      USD: parseFloat((basePrice.USD - finalPrice.USD).toFixed(2)),
      INR: parseFloat((basePrice.INR - finalPrice.INR).toFixed(2)),
    };
  };

  // Get original monthly price for comparison
  const getOriginalPrice = () => {
    if (plan === "free") return { USD: 0.0, INR: 0.0 };

    switch (plan) {
      case "basic":
        return { USD: 29.0, INR: 499.0 };
      case "pro":
        return { USD: 49.0, INR: 999.0 };
      default:
        return { USD: 29.0, INR: 499.0 };
    }
  };

  // Format price with decimal places
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const finalPrice = calculateFinalPrice();
  const discountAmount = calculateDiscountAmount();
  const showDiscount = billingCycle === "yearly" || couponApplied;
  const originalPrice =
    billingCycle === "yearly" ? getOriginalPrice() : planDetails.price;

  const onSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    // This would be where you connect to a payment gateway
    console.log("Form data:", data);
    console.log("Selected plan:", planDetails.name);
    console.log("Original price:", originalPrice[currency]);
    console.log("Final price:", finalPrice[currency]);
    console.log("Discount amount:", discountAmount[currency]);
    console.log("Currency:", currency);
    console.log("Billing cycle:", billingCycle);
    console.log(
      "Coupon applied:",
      couponApplied
        ? {
            code: couponDetails?.code,
            type: couponType,
            value: couponDiscount,
            description: couponDetails?.description,
          }
        : "None"
    );

    // For Free tier, skip payment processing
    if (plan === "free") {
      // Just redirect to thank you page
      setTimeout(() => {
        router.push(`/checkout/thank-you?plan=${plan}`);
        setIsSubmitting(false);
      }, 1000);
      return;
    }

    if (data.country === "India" && data.paymentMethod !== "card") {
      // Redirect to Razorpay for Indian payment methods
      console.log(
        "Redirecting to Razorpay for payment method:",
        data.paymentMethod
      );
    }

    // Simulate payment processing
    setTimeout(() => {
      // Redirect to thank you page after successful payment
      router.push(`/checkout/thank-you?plan=${plan}&billing=${billingCycle}`);
      setIsSubmitting(false);
    }, 2000);
  };

  // Generate years for expiry date select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear + i).toString()
  );

  // Generate months for expiry date select
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month < 10 ? `0${month}` : month.toString();
  });

  // Countries list (shortened for brevity)
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "India",
    "Germany",
    "France",
    "Japan",
    "China",
    "Brazil",
  ];

  // Get available upgrade and downgrade options
  const getUpgradeOptions = () => {
    const upgrades = planDetails.upgrades || [];
    const downgrades = planDetails.downgrades || [];

    return [...upgrades, ...downgrades];
  };

  // Get plan name for UI display
  const getPlanName = (planId: string) => {
    switch (planId) {
      case "free":
        return "Free Plan";
      case "basic":
        return "Basic Plan";
      case "pro":
        return "Pro Plan";
      default:
        return "Basic Plan";
    }
  };

  // Determine if user is in India
  const isIndianUser = selectedCountry === "India";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        <div className="container max-w-6xl py-8 mx-auto px-4">
          <Link
            href="/"
            className="flex items-center mb-6 text-yellow-500 font-bold text-2xl"
          >
            Reebews
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Checkout</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/" className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to home</span>
                    </Link>
                  </Button>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Billing Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john.doe@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="ACME Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedCountry(value);
                              }}
                              defaultValue={field.value}
                              value={field.value || selectedCountry}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isIndianUser && (
                        <FormField
                          control={form.control}
                          name="gstNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="22AAAAA0000A1Z5"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      {plan !== "free" && (
                        <>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                              Payment Information
                            </h3>
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>

                          {isIndianUser ? (
                            <FormField
                              control={form.control}
                              name="paymentMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Method</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-3"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                        <FormControl>
                                          <RadioGroupItem value="card" />
                                        </FormControl>
                                        <div className="flex items-center justify-between w-full">
                                          <FormLabel className="font-normal cursor-pointer">
                                            Credit/Debit Card
                                          </FormLabel>
                                          <div className="flex gap-2">
                                            <Image
                                              src="/uploads/icons/mode-of-payments/visa.svg"
                                              alt="Visa"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                            <Image
                                              src="/uploads/icons/mode-of-payments/mastercard.svg"
                                              alt="Mastercard"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                            <Image
                                              src="/uploads/icons/mode-of-payments/card-amex.svg"
                                              alt="American Express"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                          </div>
                                        </div>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                        <FormControl>
                                          <RadioGroupItem value="upi" />
                                        </FormControl>
                                        <div className="flex items-center justify-between w-full">
                                          <FormLabel className="font-normal cursor-pointer">
                                            UPI
                                          </FormLabel>
                                          <Image
                                            src="/uploads/icons/mode-of-payments/upi.svg"
                                            alt="UPI"
                                            width={24}
                                            height={24}
                                            className="dark:invert"
                                          />
                                        </div>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                        <FormControl>
                                          <RadioGroupItem value="netbanking" />
                                        </FormControl>
                                        <div className="flex items-center justify-between w-full">
                                          <FormLabel className="font-normal cursor-pointer">
                                            Net Banking
                                          </FormLabel>
                                          <Image
                                            src="/uploads/icons/mode-of-payments/netbanking.svg"
                                            alt="Net Banking"
                                            width={24}
                                            height={24}
                                            className="dark:invert"
                                          />
                                        </div>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                                        <FormControl>
                                          <RadioGroupItem value="wallet" />
                                        </FormControl>
                                        <div className="flex items-center justify-between w-full">
                                          <FormLabel className="font-normal cursor-pointer">
                                            Wallet
                                          </FormLabel>
                                          <Image
                                            src="/uploads/icons/mode-of-payments/wallet.svg"
                                            alt="Wallet"
                                            width={24}
                                            height={24}
                                            className="dark:invert"
                                          />
                                        </div>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                  <div className="mt-4">
                                    <p className="text-sm text-muted-foreground mb-2">
                                      You will be redirected to RazorPay to
                                      complete your payment.
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <p className="text-xs text-muted-foreground">
                                        Powered by
                                      </p>
                                      <Image
                                        src="/uploads/icons/payment-gateways/razorpay-icon.svg"
                                        alt="Razorpay"
                                        width={80}
                                        height={24}
                                        className="dark:invert"
                                      />
                                    </div>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ) : (
                            <>
                              <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Payment Method</FormLabel>
                                    <FormControl>
                                      <div className="p-4 border rounded-md">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center space-x-2">
                                            <CreditCard className="h-5 w-5" />
                                            <span>Credit/Debit Card</span>
                                          </div>
                                          <div className="flex gap-2">
                                            <Image
                                              src="/uploads/icons/mode-of-payments/visa.svg"
                                              alt="Visa"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                            <Image
                                              src="/uploads/icons/mode-of-payments/mastercard.svg"
                                              alt="Mastercard"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                            <Image
                                              src="/uploads/icons/mode-of-payments/card-amex.svg"
                                              alt="American Express"
                                              width={24}
                                              height={24}
                                              className="dark:invert"
                                            />
                                          </div>
                                        </div>
                                        <div className="mt-4">
                                          <div className="flex items-center gap-3">
                                            <p className="text-xs text-muted-foreground">
                                              Powered by
                                            </p>
                                            <Image
                                              src="/uploads/icons/payment-gateways/icons8-stripe.svg"
                                              alt="Stripe"
                                              width={60}
                                              height={24}
                                              className="dark:invert"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cardName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name on Card</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="John Doe"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          placeholder="1234 5678 9012 3456"
                                          {...field}
                                          maxLength={19}
                                        />
                                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="expiryMonth"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Expiry Month</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="MM" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {months.map((month) => (
                                                <SelectItem
                                                  key={month}
                                                  value={month}
                                                >
                                                  {month}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="expiryYear"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Expiry Year</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger className="w-full">
                                                <SelectValue placeholder="YY" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {years.map((year) => (
                                                <SelectItem
                                                  key={year}
                                                  value={year}
                                                >
                                                  {year}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                                <FormField
                                  control={form.control}
                                  name="cvc"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVC</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="123"
                                          {...field}
                                          maxLength={4}
                                          className="w-full"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the{" "}
                                <Link
                                  href="/terms"
                                  className="text-yellow-500 hover:underline"
                                >
                                  terms and conditions
                                </Link>
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Add coupon code section */}
                    {plan !== "free" && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Have a coupon?</h4>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-grow"
                          />
                          <Button
                            type="button"
                            onClick={applyCoupon}
                            variant="outline"
                            size="sm"
                            className="whitespace-nowrap"
                          >
                            Apply
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-red-500 mt-1">
                            {couponError}
                          </p>
                        )}
                        {couponApplied && couponDetails && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {couponDetails.code}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  {couponDetails.description}
                                </p>
                              </div>
                              <Button
                                type="button"
                                onClick={() => {
                                  setCouponCode("");
                                  setCouponApplied(false);
                                  setCouponDetails(null);
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs hover:bg-green-100 dark:hover:bg-green-900"
                              >
                                Remove
                              </Button>
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              You save:{" "}
                              {currency === "USD"
                                ? `$${formatPrice(discountAmount.USD)}`
                                : `₹${formatPrice(discountAmount.INR)}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : plan === "free"
                        ? "Get Started Free"
                        : "Complete Order"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="font-medium">{planDetails.name}</span>
                  </div>

                  {plan !== "free" && (
                    <div className="flex justify-between">
                      <span>Billing Cycle</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBillingCycle("monthly")}
                          className={`text-sm px-2 py-1 rounded ${
                            billingCycle === "monthly"
                              ? "bg-yellow-500 text-black font-medium"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setBillingCycle("yearly")}
                          className={`text-sm px-2 py-1 rounded flex items-center gap-1 ${
                            billingCycle === "yearly"
                              ? "bg-yellow-500 text-black font-medium"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          Yearly
                          {billingCycle === "yearly" && (
                            <span className="text-xs font-bold">-30%</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Description</span>
                    <span className="text-muted-foreground">
                      {planDetails.description}
                    </span>
                  </div>

                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <div className="flex flex-col items-end">
                      {showDiscount && plan !== "free" && (
                        <span className="text-sm line-through text-muted-foreground">
                          {currency === "USD"
                            ? `$${formatPrice(originalPrice.USD)}`
                            : `₹${formatPrice(originalPrice.INR)}`}
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                      <span>
                        {currency === "USD"
                          ? `$${formatPrice(finalPrice.USD)}`
                          : `₹${formatPrice(finalPrice.INR)}`}
                        {plan !== "free" &&
                          `/${billingCycle === "monthly" ? "month" : "year"}`}
                      </span>
                      {showDiscount && plan !== "free" && (
                        <span className="text-xs text-green-500">
                          {currency === "USD"
                            ? `$${formatPrice(discountAmount.USD)}`
                            : `₹${formatPrice(discountAmount.INR)}`}{" "}
                          off
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Plan Features:</h4>
                    <ul className="space-y-1 text-sm">
                      {planDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Additional Options:</h4>
                    <div className="space-y-2">
                      {getUpgradeOptions().map((planOption) => (
                        <Link
                          key={planOption}
                          href={`/checkout?plan=${planOption}&billing=${billingCycle}`}
                          className="flex items-center justify-between p-2 border rounded hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {planOption === "pro" && plan !== "pro" && (
                              <Badge className="bg-green-500">Upgrade</Badge>
                            )}
                            {planOption === "basic" && plan === "pro" && (
                              <Badge variant="outline">Downgrade</Badge>
                            )}
                            {planOption === "basic" && plan === "free" && (
                              <Badge className="bg-green-500">Upgrade</Badge>
                            )}
                            <span>{getPlanName(planOption)}</span>
                          </div>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground space-y-2">
                      {plan !== "free" && (
                        <>
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            <span>Secure checkout</span>
                          </div>
                          <p>
                            Your payment information is processed securely. We
                            do not store credit card details.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export component with Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent />
    </Suspense>
  );
}
