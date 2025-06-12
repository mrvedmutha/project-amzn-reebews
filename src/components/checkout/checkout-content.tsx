"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BillingForm } from "@/components/checkout/billing-form";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCheckout } from "@/hooks/checkout/use-checkout.hook";
import { Plan } from "@/enums/checkout.enum";

export function CheckoutContent() {
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Billing Information */}
                    <BillingForm
                      form={form}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      isIndianUser={isIndianUser}
                    />

                    {/* Payment Information */}
                    <PaymentForm
                      form={form}
                      isIndianUser={isIndianUser}
                      plan={plan}
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