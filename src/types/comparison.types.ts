export interface Feature {
  name: string;
  free: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
  tooltip?: string;
} 