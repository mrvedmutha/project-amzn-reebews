import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Lock } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
// Removed unused useRouter import

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Removed unused imports
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CheckoutFormValues } from "@/types/checkout.types";
import { initializeRazorpayPayment } from "@/lib/razorpay-client";

interface PaymentFormProps {
  form: UseFormReturn<CheckoutFormValues>;
  isIndianUser: boolean;
  plan: string;
  amount: number;
}

export interface PaymentFormRef {
  initiatePayment: (paymentMethod: string) => Promise<void>;
}

export const PaymentForm = React.forwardRef<PaymentFormRef, PaymentFormProps>(
  ({ form, isIndianUser, plan, amount }, ref) => {
    const handleRazorpayPayment = async (paymentMethod: string) => {
      try {
        // Payment loading handled by parent component

        // Create Razorpay order via API
        const response = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
              plan: plan,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        const order = await response.json();

        // Initialize Razorpay payment
        initializeRazorpayPayment({
          orderId: order.id,
          paymentMethod: paymentMethod as
            | "card"
            | "upi"
            | "netbanking"
            | "wallet",
          userEmail: form.getValues("email") || "",
          userName: `${form.getValues("firstName") || ""} ${
            form.getValues("lastName") || ""
          }`.trim(),
          userPhone: "", // Phone number is not part of the form schema
        });
      } catch (error) {
        console.error("Payment initialization failed:", error);
        // Handle error appropriately
      } finally {
        // Payment loading handled by parent component
      }
    };

    // Expose the payment handler through ref
    React.useImperativeHandle(ref, () => ({
      initiatePayment: async (paymentMethod: string) => {
        await handleRazorpayPayment(paymentMethod);
      },
    }));

    if (plan === "free") return null;

    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Payment Information</h3>
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
                      You will be redirected to RazorPay to complete your
                      payment.
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
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                You will be redirected to PayPal to complete your payment
                securely. All major credit cards are accepted through PayPal.
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Powered by</p>
                <Image
                  src="/uploads/icons/payment-gateways/paypal-icon-light.svg"
                  alt="PayPal"
                  width={80}
                  height={24}
                  className="dark:invert"
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
);

PaymentForm.displayName = "PaymentForm";
