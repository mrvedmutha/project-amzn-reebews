import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { CreditCard, Lock } from "lucide-react";
import Image from "next/image";

import {
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CheckoutFormValues } from "@/types/checkout.types";

interface PaymentFormProps {
  form: UseFormReturn<CheckoutFormValues>;
  isIndianUser: boolean;
  plan: string;
}

export function PaymentForm({ form, isIndianUser, plan }: PaymentFormProps) {
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

  if (plan === "free") return null;

  return (
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
                  You will be redirected to RazorPay to complete your payment.
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">Powered by</p>
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
                  <Input placeholder="John Doe" {...field} />
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
                            <SelectItem key={month} value={month}>
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
                            <SelectItem key={year} value={year}>
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
    </div>
  );
} 