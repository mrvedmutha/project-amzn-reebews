import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CheckoutFormValues } from "@/types/checkout.types";
import {
  Country,
  IndianState,
  USState,
  CanadianProvince,
  GermanState,
  AustralianState,
  BrazilianState,
  SouthAfricanProvince,
} from "@/enums/checkout.enum";
import { getPostalCodeConfig, requiresState } from "@/lib/validation/postal-code-validation";

interface BillingFormProps {
  form: UseFormReturn<CheckoutFormValues>;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  isIndianUser: boolean;
}

export function BillingForm({
  form,
  selectedCountry,
  setSelectedCountry,
  isIndianUser,
}: BillingFormProps) {
  const [stateOpen, setStateOpen] = React.useState(false);

  // Get states based on selected country
  const getStatesForCountry = (country: string) => {
    switch (country) {
      case Country.INDIA:
        return Object.values(IndianState);
      case Country.UNITED_STATES:
        return Object.values(USState);
      case Country.CANADA:
        return Object.values(CanadianProvince);
      case Country.GERMANY:
        return Object.values(GermanState);
      case Country.AUSTRALIA:
        return Object.values(AustralianState);
      case Country.BRAZIL:
        return Object.values(BrazilianState);
      case Country.SOUTH_AFRICA:
        return Object.values(SouthAfricanProvince);
      default:
        return [];
    }
  };

  const states = getStatesForCountry(selectedCountry);
  const showStateField = states.length > 0;
  
  // Get postal code configuration for the selected country
  const postalCodeConfig = getPostalCodeConfig(selectedCountry as Country);
  
  // Get appropriate state/province label
  const getStateLabel = (country: string) => {
    switch (country) {
      case Country.CANADA:
        return "Province";
      case Country.GERMANY:
        return "State (Land)";
      case Country.AUSTRALIA:
        return "State/Territory";
      case Country.BRAZIL:
        return "State";
      case Country.SOUTH_AFRICA:
        return "Province";
      default:
        return "State";
    }
  };

  // Reset state when country changes
  React.useEffect(() => {
    if (selectedCountry) {
      const currentState = form.getValues("address.state");
      const validStates = getStatesForCountry(selectedCountry);
      const countryRequiresState = requiresState(selectedCountry as Country);
      
      // Clear state if country doesn't require states
      if (!countryRequiresState && currentState) {
        form.setValue("address.state", "");
      }
      // Reset if current state is not valid for the selected country that has states
      else if (currentState && validStates.length > 0 && !(validStates as string[]).includes(currentState)) {
        form.setValue("address.state", "");
      }
    }
  }, [selectedCountry, form]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Billing Information</h3>

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
              <Input placeholder="john.doe@example.com" {...field} />
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
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
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
          name="address.city"
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
          name="address.pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{postalCodeConfig.label}</FormLabel>
              <FormControl>
                <Input placeholder={postalCodeConfig.placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showStateField && (
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  {getStateLabel(selectedCountry)}
                </FormLabel>
                <Popover open={stateOpen} onOpenChange={setStateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? states.find((state) => state === field.value)
                          : `Select a ${getStateLabel(selectedCountry).toLowerCase()}`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder={`Search ${getStateLabel(selectedCountry).toLowerCase()}...`}
                      />
                      <CommandEmpty>
                        No {getStateLabel(selectedCountry).toLowerCase()} found.
                      </CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {states.map((state) => (
                          <CommandItem
                            key={state}
                            value={state}
                            onSelect={(currentValue) => {
                              field.onChange(
                                currentValue === field.value ? "" : currentValue
                              );
                              setStateOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === state
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {state}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem>
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
                  {Object.values(Country).map((country) => (
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
      </div>

      {isIndianUser && (
        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="22AAAAA0000A1Z5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
