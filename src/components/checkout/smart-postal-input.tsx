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
      
      // For UK postcodes, we need to handle different patterns:
      // A9 9AA, A99 9AA, AA9 9AA, AA99 9AA, A9A 9AA, AA9A 9AA
      if (alphanumeric.length <= 3) return alphanumeric;
      if (alphanumeric.length <= 4) {
        // Could be A9A pattern, check if 3rd char is letter
        if (/^[A-Z]\d[A-Z]/.test(alphanumeric)) {
          return alphanumeric;
        }
        // Otherwise add space after 3rd character for A99 pattern
        return `${alphanumeric.slice(0, 3)} ${alphanumeric.slice(3)}`;
      }
      if (alphanumeric.length <= 5) {
        // Check for A9A pattern
        if (/^[A-Z]\d[A-Z]/.test(alphanumeric)) {
          return `${alphanumeric.slice(0, 3)} ${alphanumeric.slice(3)}`;
        }
        // AA99 or A999 pattern  
        return `${alphanumeric.slice(0, 4)} ${alphanumeric.slice(4)}`;
      }
      if (alphanumeric.length <= 6) {
        // AA9A pattern
        if (/^[A-Z]{2}\d[A-Z]/.test(alphanumeric)) {
          return `${alphanumeric.slice(0, 4)} ${alphanumeric.slice(4)}`;
        }
        // Other patterns
        const outcode = /^[A-Z]\d[A-Z]/.test(alphanumeric) ? 3 : 4;
        return `${alphanumeric.slice(0, outcode)} ${alphanumeric.slice(outcode)}`;
      }
      // Max 7 characters with space
      const outcode = /^[A-Z]\d[A-Z]/.test(alphanumeric) ? 3 : 4;
      return `${alphanumeric.slice(0, outcode)} ${alphanumeric.slice(outcode, outcode + 3)}`;
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
    
    // Dynamic placeholder based on country and current input
    const getDynamicPlaceholder = () => {
      if (!value || value.length === 0) {
        return config.placeholder;
      }
      
      // Show format hint based on country
      switch (country) {
        case Country.CANADA:
          return value.length <= 3 ? "K1A 0A6" : "0A6";
        case Country.UNITED_KINGDOM:
          if (value.length <= 2) return "SW1A 1AA";
          if (value.length <= 4) return "1AA";
          return "AA";
        case Country.JAPAN:
          return value.length <= 3 ? "123-4567" : "4567";
        case Country.NETHERLANDS:
          return value.length <= 4 ? "1234 AB" : "AB";
        case Country.BRAZIL:
          return value.length <= 5 ? "12345-678" : "678";
        case Country.UNITED_STATES:
          if (value.length <= 5) return "12345-6789";
          return "6789";
        default:
          return config.placeholder;
      }
    };
    
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
        placeholder={getDynamicPlaceholder()}
        className={cn(className)}
        autoComplete="postal-code"
        {...props}
      />
    );
  }
);

SmartPostalInput.displayName = "SmartPostalInput";