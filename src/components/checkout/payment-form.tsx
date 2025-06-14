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
import { initializePayPalPayment, loadPayPalSDK } from "@/lib/paypal-client";

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
    // Removed unused variables
    const [paypalLoaded, setPaypalLoaded] = React.useState(false);
    const paypalButtonRef = React.useRef<HTMLDivElement>(null);

    // Removed unused date generation code

    // Load PayPal SDK for non-Indian users
    React.useEffect(() => {
      if (!isIndianUser && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        loadPayPalSDK(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
          .then(() => {
            setPaypalLoaded(true);
          })
          .catch((error: Error) => {
            console.error("Failed to load PayPal SDK:", error);
          });
      }
    }, [isIndianUser]);

    // Initialize PayPal buttons when loaded and payment method is PayPal
    const paymentMethod = form.watch("paymentMethod");
    React.useEffect(() => {
      if (
        !isIndianUser &&
        paypalLoaded &&
        paymentMethod === "paypal" &&
        paypalButtonRef.current
      ) {
        // Clear existing buttons
        paypalButtonRef.current.innerHTML = "";

        // Create PayPal order first
        fetch("/api/paypal/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount,
            currency: "USD",
            description: `Reebews ${plan} Plan`,
            reference_id: `order_${Date.now()}`,
          }),
        })
          .then((response) => response.json())
          .then((order) => {
            if (order.id) {
              const paypalButtons = initializePayPalPayment({
                orderId: order.id,
                userEmail: form.getValues("email") || "",
                userName: `${form.getValues("firstName") || ""} ${
                  form.getValues("lastName") || ""
                }`.trim(),
                amount: amount,
                currency: "USD",
              });

              paypalButtons.render(paypalButtonRef.current);
            }
          })
          .catch((error) => {
            console.error("Failed to create PayPal order:", error);
          });
      }
    }, [paypalLoaded, paymentMethod, amount, plan, form, isIndianUser]);

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

    const handlePayPalPayment = async () => {
      // PayPal payment is handled by the PayPal buttons component
      // This function is called when PayPal is selected but the actual payment
      // is handled by the PayPal buttons in the useEffect above
      console.log("PayPal payment selected");
    };

    // Expose the payment handler through ref
    React.useImperativeHandle(ref, () => ({
      initiatePayment: async (paymentMethod: string) => {
        if (paymentMethod === "paypal") {
          await handlePayPalPayment();
        } else {
          await handleRazorpayPayment(paymentMethod);
        }
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
            <>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || "paypal"}
                        className="flex flex-col space-y-3"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent">
                          <FormControl>
                            <RadioGroupItem value="paypal" />
                          </FormControl>
                          <div className="flex items-center justify-between w-full">
                            <FormLabel className="font-normal cursor-pointer">
                              PayPal
                            </FormLabel>
                            <Image
                              src="/uploads/icons/payment-gateways/paypal-icon.svg"
                              alt="PayPal"
                              width={50}
                              height={50}
                            />
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PayPal Buttons Container */}
              {form.watch("paymentMethod") === "paypal" && (
                <div className="mt-4">
                  <div
                    ref={paypalButtonRef}
                    className="paypal-buttons-container"
                  />
                  {!paypalLoaded && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Loading PayPal...
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Secure payment processing with PayPal. All major credit cards
                  accepted.
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
            </>
          )}
        </div>
      </>
    );
  }
);

PaymentForm.displayName = "PaymentForm";
