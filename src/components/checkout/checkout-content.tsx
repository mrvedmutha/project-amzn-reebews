"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BillingForm } from "@/components/checkout/billing-form";
import {
  PaymentForm,
  PaymentFormRef,
} from "@/components/checkout/payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCheckout } from "@/hooks/checkout/use-checkout.hook";
import { Plan } from "@/enums/checkout.enum";

export function CheckoutContent() {
  const paymentFormRef = React.useRef<PaymentFormRef>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const {
    form,
    isSubmitting,
    onSubmit,
    plan,
    planDetails,
    billingCycle,
    setBillingCycle,
    selectedCountry,
    setSelectedCountry,
    isIndianUser,
    currency,
    finalPrice,
    originalPrice,
    discountAmount,
    showDiscount,
    formatPrice,
    couponCode,
    setCouponCode,
    couponError,
    couponApplied,
    couponDetails,
    applyCoupon,
    removeCoupon,
    existingCart,
    isCartLoading,
    cartLoadError,
    paymentError,
  } = useCheckout();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const couponFromUrl = params.get("coupon");
      if (couponFromUrl && !couponApplied) {
        setCouponCode(couponFromUrl);
        applyCoupon();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompleteOrder = async (data: any) => {
    try {
      setIsProcessing(true);

      if (plan === "free") {
        // Handle free plan signup
        await onSubmit(data);
      } else {
        let cartId: string;

        if (existingCart) {
          // Use existing cart for payment retry
          cartId = existingCart._id.toString();
        } else {
          // Create new cart record
          const userDetails = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            address: {
              street: data.address.street,
              city: data.address.city,
              state: data.address.state,
              country: data.address.country,
              pincode: data.address.pincode,
            },
            company: data.companyName,
            gstNumber: data.gstNumber,
          };

          const response = await fetch("/api/cart/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              plan,
              currency: isIndianUser ? "INR" : "USD",
              amount: isIndianUser ? finalPrice.INR : finalPrice.USD,
              userDetails,
              paymentGateway: isIndianUser ? "razorpay" : "paypal",
              billingCycle,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create cart");
          }

          const result = await response.json();
          cartId = result.cartId;
        }

        localStorage.setItem("currentCartId", cartId);

        if (isIndianUser) {
          // Handle Razorpay for Indian users
          const paymentMethod = data.paymentMethod;
          if (paymentFormRef.current && paymentMethod) {
            await paymentFormRef.current.initiatePayment(paymentMethod, cartId);
          }
        } else {
          // Handle PayPal for non-Indian users
          const response = await fetch("/api/payment/paypal/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId,
              amount: finalPrice.USD,
              currency: "USD",
              description: `Reebews ${plan} Plan`,
              reference_id: `order_${Date.now()}`,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create PayPal order");
          }

          const { redirectUrl } = await response.json();
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      console.error("Order processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
                  <div>
                    <h2 className="text-2xl font-bold">
                      {existingCart ? "Complete Your Order" : "Checkout"}
                    </h2>
                    {existingCart && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Your details have been pre-filled. Complete your payment
                        to proceed.
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/" className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to home</span>
                    </Link>
                  </Button>
                </div>

                {/* Cart Loading State */}
                {isCartLoading && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700">
                      Loading your cart details...
                    </p>
                  </div>
                )}

                {/* Cart Load Error */}
                {cartLoadError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{cartLoadError}</p>
                    <Link
                      href="/checkout"
                      className="text-red-700 underline font-medium"
                    >
                      Start new checkout
                    </Link>
                  </div>
                )}

                {/* Payment Error */}
                {paymentError && !cartLoadError && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700">
                      {paymentError === "payment_cancelled"
                        ? "Payment was cancelled. Your details are saved - you can complete your order below."
                        : paymentError === "payment_failed"
                          ? "Payment failed. Please try again with a different payment method."
                          : "There was an issue with your payment. Please try again."}
                    </p>
                  </div>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCompleteOrder)}
                    className="space-y-6"
                  >
                    {/* Billing Information */}
                    <BillingForm
                      form={form}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      isIndianUser={isIndianUser}
                    />

                    {/* Payment Information */}
                    <PaymentForm
                      ref={paymentFormRef}
                      form={form}
                      isIndianUser={isIndianUser}
                      plan={plan}
                      amount={isIndianUser ? finalPrice.INR : finalPrice.USD}
                    />

                    {/* Terms and Conditions */}
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

                    {/* Coupon Section */}
                    {plan !== Plan.FREE && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Have a coupon?</h4>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-grow"
                            disabled={couponApplied}
                          />
                          <Button
                            type="button"
                            onClick={applyCoupon}
                            variant={couponApplied ? undefined : "outline"}
                            size="sm"
                            className={`whitespace-nowrap ${couponApplied ? "bg-green-600 text-white border-green-600 hover:bg-green-700" : ""}`}
                            disabled={couponApplied}
                          >
                            {couponApplied ? (
                              <span className="flex items-center gap-1">
                                <Check className="h-5 w-5" />
                                Applied
                              </span>
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                        {couponError && (
                          <p className="text-sm text-red-500 mt-1">
                            {couponError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Complete Order button for all payment types */}
                    <Button
                      type="submit"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                      disabled={isSubmitting || isProcessing}
                    >
                      {isSubmitting || isProcessing
                        ? "Please wait..."
                        : plan === "free"
                          ? "Get Started Free"
                          : isIndianUser
                            ? "Complete Order"
                            : "Pay with PayPal"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                planDetails={planDetails}
                plan={plan}
                billingCycle={billingCycle}
                setBillingCycle={setBillingCycle}
                currency={currency}
                finalPrice={finalPrice}
                originalPrice={originalPrice}
                discountAmount={discountAmount}
                showDiscount={showDiscount}
                formatPrice={formatPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
