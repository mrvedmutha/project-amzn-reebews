"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
  } = useCheckout();

  const handleCompleteOrder = async (data: any) => {
    try {
      setIsProcessing(true);

      if (plan === "free") {
        // Handle free plan signup
        await onSubmit(data);
      } else {
        // Format user details according to cart schema
        const userDetails = {
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          address: data.address,
          company: data.companyName,
          gstNumber: data.gstNumber,
        };

        // Create cart record first
        const response = await fetch("/api/cart/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan,
            currency,
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

        const { cartId } = await response.json();
        localStorage.setItem("currentCartId", cartId);

        if (isIndianUser) {
          // Handle Razorpay for Indian users
          const paymentMethod = data.paymentMethod;
          if (paymentFormRef.current && paymentMethod) {
            await paymentFormRef.current.initiatePayment(paymentMethod, cartId);
          }
        } else {
          // Handle PayPal for non-Indian users
          const response = await fetch("/api/paypal/create-order-redirect", {
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
                                onClick={removeCoupon}
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
