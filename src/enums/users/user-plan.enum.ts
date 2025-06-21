/**
 * User plan types for subscription management
 * Plan IDs: 0 = FREE, 1 = BASIC, 2 = PRO, 3 = ENTERPRISE
 */
export enum UserPlan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
}

/**
 * @deprecated Use Plan enum from checkout.enum.ts instead
 * This enum is kept for backward compatibility
 */
export enum UserPlanLegacy {
  FREE = "free",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
