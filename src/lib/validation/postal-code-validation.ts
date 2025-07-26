import { Country } from "@/enums/checkout.enum";

/**
 * Postal code patterns for major countries by continent
 */
export const POSTAL_CODE_PATTERNS = {
  // North America
  [Country.UNITED_STATES]: {
    pattern: /^\d{5}(-\d{4})?$/,
    label: "ZIP Code",
    placeholder: "12345 or 12345-6789",
    errorMessage: "Please enter a valid ZIP code (12345 or 12345-6789)"
  },
  [Country.CANADA]: {
    pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/,
    label: "Postal Code",
    placeholder: "K1A 0A6",
    errorMessage: "Please enter a valid postal code (K1A 0A6)"
  },

  // Europe
  [Country.UNITED_KINGDOM]: {
    pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/,
    label: "Postcode",
    placeholder: "SW1A 1AA",
    errorMessage: "Please enter a valid postcode (SW1A 1AA)"
  },
  [Country.GERMANY]: {
    pattern: /^\d{5}$/,
    label: "Postal Code",
    placeholder: "12345",
    errorMessage: "Please enter a valid 5-digit postal code"
  },
  [Country.FRANCE]: {
    pattern: /^\d{5}$/,
    label: "Postal Code",
    placeholder: "75001",
    errorMessage: "Please enter a valid 5-digit postal code"
  },
  [Country.NETHERLANDS]: {
    pattern: /^\d{4}\s?[A-Z]{2}$/,
    label: "Postal Code",
    placeholder: "1012 AB",
    errorMessage: "Please enter a valid postal code (1012 AB)"
  },
  [Country.SPAIN]: {
    pattern: /^\d{5}$/,
    label: "Postal Code",
    placeholder: "28001",
    errorMessage: "Please enter a valid 5-digit postal code"
  },
  [Country.ITALY]: {
    pattern: /^\d{5}$/,
    label: "Postal Code",
    placeholder: "00118",
    errorMessage: "Please enter a valid 5-digit postal code"
  },

  // Asia-Pacific
  [Country.INDIA]: {
    pattern: /^\d{6}$/,
    label: "Pincode",
    placeholder: "110001",
    errorMessage: "Please enter a valid 6-digit pincode"
  },
  [Country.AUSTRALIA]: {
    pattern: /^\d{4}$/,
    label: "Postcode",
    placeholder: "2000",
    errorMessage: "Please enter a valid 4-digit postcode"
  },
  [Country.JAPAN]: {
    pattern: /^\d{3}-?\d{4}$/,
    label: "Postal Code",
    placeholder: "100-0001",
    errorMessage: "Please enter a valid postal code (100-0001)"
  },
  [Country.SINGAPORE]: {
    pattern: /^\d{6}$/,
    label: "Postal Code",
    placeholder: "018956",
    errorMessage: "Please enter a valid 6-digit postal code"
  },
  [Country.SOUTH_KOREA]: {
    pattern: /^\d{5}$/,
    label: "Postal Code",
    placeholder: "06292",
    errorMessage: "Please enter a valid 5-digit postal code"
  },

  // South America
  [Country.BRAZIL]: {
    pattern: /^\d{5}-?\d{3}$/,
    label: "CEP",
    placeholder: "01310-100",
    errorMessage: "Please enter a valid CEP (01310-100)"
  },
  [Country.ARGENTINA]: {
    pattern: /^[A-Z]\d{4}[A-Z]{3}$/,
    label: "Postal Code",
    placeholder: "C1000AAA",
    errorMessage: "Please enter a valid postal code (C1000AAA)"  
  },

  // Africa
  [Country.SOUTH_AFRICA]: {
    pattern: /^\d{4}$/,
    label: "Postal Code",
    placeholder: "0001",
    errorMessage: "Please enter a valid 4-digit postal code"
  }
} as const;

/**
 * Default pattern for countries not explicitly defined
 */
export const DEFAULT_POSTAL_CODE = {
  pattern: /^.{2,10}$/,
  label: "Postal Code",
  placeholder: "Enter postal code",
  errorMessage: "Please enter a valid postal code"
};

/**
 * Validates a postal code for a specific country
 */
export function validatePostalCode(postalCode: string, country: Country): boolean {
  const config = POSTAL_CODE_PATTERNS[country] || DEFAULT_POSTAL_CODE;
  return config.pattern.test(postalCode.toUpperCase().trim());
}

/**
 * Gets postal code configuration for a country
 */
export function getPostalCodeConfig(country: Country) {
  return POSTAL_CODE_PATTERNS[country] || DEFAULT_POSTAL_CODE;
}

/**
 * Countries that require state/province selection
 */
export const COUNTRIES_WITH_STATES = [
  Country.INDIA,
  Country.UNITED_STATES,
  Country.CANADA, 
  Country.GERMANY,
  Country.AUSTRALIA,
  Country.BRAZIL,
  Country.SOUTH_AFRICA,
] as const;

/**
 * Checks if a country requires state/province selection
 */
export function requiresState(country: Country): boolean {
  return COUNTRIES_WITH_STATES.includes(country as any);
}

/**
 * Formats postal code according to country standards
 */
export function formatPostalCode(postalCode: string, country: Country): string {
  const trimmed = postalCode.toUpperCase().trim();
  
  switch (country) {
    case Country.CANADA:
      // Format as "A1A 1A1"
      return trimmed.replace(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/, '$1 $2');
    
    case Country.UNITED_KINGDOM:
      // Add space before last 3 characters if missing
      return trimmed.replace(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/, '$1 $2');
    
    case Country.NETHERLANDS:
      // Format as "1234 AB"
      return trimmed.replace(/^(\d{4})([A-Z]{2})$/, '$1 $2');
    
    case Country.JAPAN:
      // Format as "123-4567"
      return trimmed.replace(/^(\d{3})(\d{4})$/, '$1-$2');
    
    case Country.BRAZIL:
      // Format as "12345-678"
      return trimmed.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    
    default:
      return trimmed;
  }
}