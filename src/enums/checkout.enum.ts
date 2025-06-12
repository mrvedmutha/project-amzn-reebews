/**
 * Payment methods supported in checkout
 */
export enum PaymentMethod {
  CARD = 'card',
  UPI = 'upi',
  NET_BANKING = 'net-banking',
  WALLET = 'wallet',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank-transfer'
}

/**
 * Available subscription plans
 */
export enum Plan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro'
}

/**
 * Supported currencies
 */
export enum Currency {
  USD = 'USD',
  INR = 'INR'
}

/**
 * Billing cycle options
 */
export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

/**
 * Coupon discount types
 */
export enum CouponType {
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount'
}

/**
 * Supported countries for checkout
 */
export enum Country {
  INDIA = 'India',
  UNITED_STATES = 'United States',
  CANADA = 'Canada',
  UNITED_KINGDOM = 'United Kingdom',
  AUSTRALIA = 'Australia',
  GERMANY = 'Germany',
  FRANCE = 'France',
  SINGAPORE = 'Singapore',
  JAPAN = 'Japan',
  BRAZIL = 'Brazil'
} 