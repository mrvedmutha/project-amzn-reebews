import { useState } from "react";
import { Plan } from "@/enums/checkout.enum";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CheckoutHookProps {
  plan: Plan;
  billingCycle: "monthly" | "yearly";
}

export const useCheckout = ({ plan, billingCycle }: CheckoutHookProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getPlanPrice = () => {
    switch (plan) {
      case Plan.BASIC:
        return billingCycle === "yearly" ? 425 : 499;
      case Plan.PRO:
        return billingCycle === "yearly" ? 699 : 999;
      default:
        return 0;
    }
  };

  const getOriginalPrice = () => {
    switch (plan) {
      case Plan.BASIC:
        return billingCycle === "yearly" ? 499 : 499;
      case Plan.PRO:
        return billingCycle === "yearly" ? 999 : 999;
      default:
        return 0;
    }
  };

  const getDiscount = () => {
    const originalPrice = getOriginalPrice();
    const discountedPrice = getPlanPrice();
    return originalPrice - discountedPrice;
  };

  const handleCheckout = async (userDetails: any) => {
    try {
      setIsLoading(true);

      const amount = getPlanPrice();
      const currency = "INR";

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
          paymentGateway: "razorpay",
          billingCycle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create cart");
      }

      const { cartId } = await response.json();
      router.push(`/checkout/${cartId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate checkout");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCheckout,
    getPlanPrice,
    getOriginalPrice,
    getDiscount,
  };
};
