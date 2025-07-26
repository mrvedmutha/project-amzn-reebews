import * as React from "react";
import { Input } from "@/components/ui/input";
import { Country } from "@/enums/checkout.enum";
import { getPostalCodeConfig, formatPostalCode } from "@/lib/validation/postal-code-validation";
import { cn } from "@/lib/utils";

interface SmartPostalInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  country: Country;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Input type patterns for different postal code formats
 */
const getInputTypeAndPattern = (country: Country) => {
  switch (country) {
    // Numeric only countries
    case Country.UNITED_STATES:
    case Country.GERMANY:
    case Country.FRANCE:
    case Country.SPAIN:
    case Country.ITALY:
    case Country.INDIA:
    case Country.AUSTRALIA:
    case Country.SINGAPORE:
    case Country.SOUTH_KOREA:
    case Country.SOUTH_AFRICA:
      return {
        inputMode: "numeric" as const,
        pattern: "[0-9]*",
        allowedChars: /[0-9\-\s]/,
      };
    
    // Alphanumeric countries
    case Country.CANADA:
    case Country.UNITED_KINGDOM:
    case Country.NETHERLANDS:
    case Country.JAPAN:
    case Country.BRAZIL:
    case Country.ARGENTINA:
      return {
        inputMode: "text" as const,
        pattern: "[A-Za-z0-9\\-\\s]*",
        allowedChars: /[A-Za-z0-9\-\s]/,
      };
    
    default:
      return {
        inputMode: "text" as const,
        pattern: "[A-Za-z0-9\\-\\s]*",
        allowedChars: /[A-Za-z0-9\-\s]/,
      };
  }
};

/**
 * Auto-format postal code as user types
 */
const autoFormatPostalCode = (value: string, country: Country): string => {
  // Remove any non-allowed characters first
  const { allowedChars } = getInputTypeAndPattern(country);
  const cleaned = value.replace(new RegExp(`[^${allowedChars.source.slice(1, -1)}]`, 'g'), '');
  
  switch (country) {
    case Country.CANADA: {
      // Format: K1A 0A6
      const alphanumeric = cleaned.replace(/\s/g, '').toUpperCase();
      if (alphanumeric.length <= 3) return alphanumeric;
      return `${alphanumeric.slice(0, 3)} ${alphanumeric.slice(3, 6)}`;
    }
    
    case Country.UNITED_KINGDOM: {
      // Format: SW1A 1AA
      const alphanumeric = cleaned.replace(/\s/g, '').toUpperCase();
      if (alphanumeric.length <= 4) return alphanumeric;
      // Try to detect outcode/incode split
      const match = alphanumeric.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
      if (match) return `${match[1]} ${match[2]}`;
      return alphanumeric;
    }
    
    case Country.NETHERLANDS: {
      // Format: 1234 AB
      const alphanumeric = cleaned.replace(/\s/g, '').toUpperCase();
      if (alphanumeric.length <= 4) return alphanumeric;
      return `${alphanumeric.slice(0, 4)} ${alphanumeric.slice(4, 6)}`;
    }
    
    case Country.JAPAN: {
      // Format: 123-4567
      const numeric = cleaned.replace(/[\-\s]/g, '');
      if (numeric.length <= 3) return numeric;
      return `${numeric.slice(0, 3)}-${numeric.slice(3, 7)}`;
    }
    
    case Country.BRAZIL: {
      // Format: 12345-678
      const numeric = cleaned.replace(/[\-\s]/g, '');
      if (numeric.length <= 5) return numeric;
      return `${numeric.slice(0, 5)}-${numeric.slice(5, 8)}`;
    }
    
    case Country.UNITED_STATES: {
      // Format: 12345 or 12345-6789
      const numeric = cleaned.replace(/[\-\s]/g, '');
      if (numeric.length <= 5) return numeric;
      return `${numeric.slice(0, 5)}-${numeric.slice(5, 9)}`;
    }
    
    default:
      return cleaned;
  }
};

export const SmartPostalInput = React.forwardRef<HTMLInputElement, SmartPostalInputProps>(
  ({ country, value = "", onChange, className, ...props }, ref) => {
    const config = getPostalCodeConfig(country);
    const { inputMode, pattern } = getInputTypeAndPattern(country);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = autoFormatPostalCode(inputValue, country);
      onChange?.(formatted);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].includes(e.keyCode)) return;
      
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) return;
      
      // Allow arrow keys
      if (e.keyCode >= 35 && e.keyCode <= 40) return;
      
      // Check if the character is allowed for this country
      const { allowedChars } = getInputTypeAndPattern(country);
      if (!allowedChars.test(e.key)) {
        e.preventDefault();
      }
    };
    
    return (
      <Input
        ref={ref}
        type="text"
        inputMode={inputMode}
        pattern={pattern}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={config.placeholder}
        className={cn(className)}
        autoComplete="postal-code"
        {...props}
      />
    );
  }
);

SmartPostalInput.displayName = "SmartPostalInput";