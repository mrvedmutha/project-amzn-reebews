export interface IAffiliateDetails {
  name: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
}

export interface ICoupon {
  id: string;
  code: string;
  name: string;
  description: string;
  value: number; // percentage discount
  startDate: Date;
  endDate: Date;
  isAffiliated: boolean;
  affilateDetails?: IAffiliateDetails;
  isLimit: boolean;
  limit?: number;
}
