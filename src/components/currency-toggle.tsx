"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { DollarSign, IndianRupee } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { Currency } from "@/enums/checkout.enum";

export const CurrencyContext = React.createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}>({
  currency: Currency.USD,
  setCurrency: () => {},
});

export function useCurrency() {
  return React.useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const { country, loading } = useGeoLocation();

  useEffect(() => {
    // First try to use the geolocation API
    if (!loading && country) {
      if (country === "India") {
        setCurrency(Currency.INR);
        return;
      } else {
        setCurrency(Currency.USD);
        return;
      }
    }

    // Fallback to timezone detection if geolocation fails
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIndian = timezone.includes("Kolkata") || timezone.includes("India");
    setCurrency(isIndian ? Currency.INR : Currency.USD);
  }, [loading, country]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {currency === "INR" ? (
            <IndianRupee className="h-4 w-4" />
          ) : (
            <DollarSign className="h-4 w-4" />
          )}
          <span>{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency(Currency.USD)}>
          <DollarSign className="mr-2 h-4 w-4" />
          <span>USD</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency(Currency.INR)}>
          <IndianRupee className="mr-2 h-4 w-4" />
          <span>INR</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
