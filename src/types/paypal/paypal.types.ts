export interface PayPalOrder {
  id: string;
  status: string;
  intent: string;
  purchase_units: PayPalPurchaseUnit[];
  create_time: string;
  links: PayPalLink[];
}

export interface PayPalPurchaseUnit {
  reference_id: string;
  amount: PayPalAmount;
  description?: string;
}

export interface PayPalAmount {
  currency_code: string;
  value: string;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: PayPalCapturedPurchaseUnit[];
  payer: PayPalPayer;
  create_time: string;
  update_time: string;
}

export interface PayPalCapturedPurchaseUnit {
  reference_id: string;
  payments: {
    captures: PayPalCapture[];
  };
}

export interface PayPalCapture {
  id: string;
  status: string;
  amount: PayPalAmount;
  final_capture: boolean;
  create_time: string;
  update_time: string;
}

export interface PayPalPayer {
  name: {
    given_name: string;
    surname: string;
  };
  email_address: string;
  payer_id: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  event_type: string;
  summary: string;
  resource: any;
  links: PayPalLink[];
}

export interface PayPalAccessTokenResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface PayPalErrorResponse {
  name: string;
  message: string;
  debug_id: string;
  details?: PayPalErrorDetail[];
  links?: PayPalLink[];
}

export interface PayPalErrorDetail {
  field: string;
  value: string;
  location: string;
  issue: string;
  description: string;
}
