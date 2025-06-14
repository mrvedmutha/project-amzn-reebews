/**
 * Payment methods supported in checkout
 */
export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  NET_BANKING = "net-banking",
  WALLET = "wallet",
  PAYPAL = "paypal",
  BANK_TRANSFER = "bank-transfer",
}

/**
 * Available subscription plans
 */
export enum Plan {
  FREE = "free",
  BASIC = "basic",
  PRO = "pro",
}

/**
 * Supported currencies
 */
export enum Currency {
  USD = "USD",
  INR = "INR",
}

/**
 * Billing cycle options
 */
export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

/**
 * Coupon discount types
 */
export enum CouponType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

/**
 * Supported countries for checkout
 */
export enum Country {
  INDIA = "India",
  UNITED_STATES = "United States",
  CANADA = "Canada",
  UNITED_KINGDOM = "United Kingdom",
  AUSTRALIA = "Australia",
  GERMANY = "Germany",
  FRANCE = "France",
  SINGAPORE = "Singapore",
  JAPAN = "Japan",
  BRAZIL = "Brazil",
}

/**
 * Indian states for checkout
 */
export enum IndianState {
  ANDHRA_PRADESH = "Andhra Pradesh",
  ARUNACHAL_PRADESH = "Arunachal Pradesh",
  ASSAM = "Assam",
  BIHAR = "Bihar",
  CHHATTISGARH = "Chhattisgarh",
  GOA = "Goa",
  GUJARAT = "Gujarat",
  HARYANA = "Haryana",
  HIMACHAL_PRADESH = "Himachal Pradesh",
  JHARKHAND = "Jharkhand",
  KARNATAKA = "Karnataka",
  KERALA = "Kerala",
  MADHYA_PRADESH = "Madhya Pradesh",
  MAHARASHTRA = "Maharashtra",
  MANIPUR = "Manipur",
  MEGHALAYA = "Meghalaya",
  MIZORAM = "Mizoram",
  NAGALAND = "Nagaland",
  ODISHA = "Odisha",
  PUNJAB = "Punjab",
  RAJASTHAN = "Rajasthan",
  SIKKIM = "Sikkim",
  TAMIL_NADU = "Tamil Nadu",
  TELANGANA = "Telangana",
  TRIPURA = "Tripura",
  UTTAR_PRADESH = "Uttar Pradesh",
  UTTARAKHAND = "Uttarakhand",
  WEST_BENGAL = "West Bengal",
  // Union Territories
  ANDAMAN_AND_NICOBAR = "Andaman and Nicobar Islands",
  CHANDIGARH = "Chandigarh",
  DADRA_AND_NAGAR_HAVELI = "Dadra and Nagar Haveli and Daman and Diu",
  DELHI = "Delhi",
  JAMMU_AND_KASHMIR = "Jammu and Kashmir",
  LADAKH = "Ladakh",
  LAKSHADWEEP = "Lakshadweep",
  PUDUCHERRY = "Puducherry",
}

/**
 * US states for checkout
 */
export enum USState {
  ALABAMA = "Alabama",
  ALASKA = "Alaska",
  ARIZONA = "Arizona",
  ARKANSAS = "Arkansas",
  CALIFORNIA = "California",
  COLORADO = "Colorado",
  CONNECTICUT = "Connecticut",
  DELAWARE = "Delaware",
  FLORIDA = "Florida",
  GEORGIA = "Georgia",
  HAWAII = "Hawaii",
  IDAHO = "Idaho",
  ILLINOIS = "Illinois",
  INDIANA = "Indiana",
  IOWA = "Iowa",
  KANSAS = "Kansas",
  KENTUCKY = "Kentucky",
  LOUISIANA = "Louisiana",
  MAINE = "Maine",
  MARYLAND = "Maryland",
  MASSACHUSETTS = "Massachusetts",
  MICHIGAN = "Michigan",
  MINNESOTA = "Minnesota",
  MISSISSIPPI = "Mississippi",
  MISSOURI = "Missouri",
  MONTANA = "Montana",
  NEBRASKA = "Nebraska",
  NEVADA = "Nevada",
  NEW_HAMPSHIRE = "New Hampshire",
  NEW_JERSEY = "New Jersey",
  NEW_MEXICO = "New Mexico",
  NEW_YORK = "New York",
  NORTH_CAROLINA = "North Carolina",
  NORTH_DAKOTA = "North Dakota",
  OHIO = "Ohio",
  OKLAHOMA = "Oklahoma",
  OREGON = "Oregon",
  PENNSYLVANIA = "Pennsylvania",
  RHODE_ISLAND = "Rhode Island",
  SOUTH_CAROLINA = "South Carolina",
  SOUTH_DAKOTA = "South Dakota",
  TENNESSEE = "Tennessee",
  TEXAS = "Texas",
  UTAH = "Utah",
  VERMONT = "Vermont",
  VIRGINIA = "Virginia",
  WASHINGTON = "Washington",
  WEST_VIRGINIA = "West Virginia",
  WISCONSIN = "Wisconsin",
  WYOMING = "Wyoming",
}

/**
 * Canadian provinces for checkout
 */
export enum CanadianProvince {
  ALBERTA = "Alberta",
  BRITISH_COLUMBIA = "British Columbia",
  MANITOBA = "Manitoba",
  NEW_BRUNSWICK = "New Brunswick",
  NEWFOUNDLAND_AND_LABRADOR = "Newfoundland and Labrador",
  NORTHWEST_TERRITORIES = "Northwest Territories",
  NOVA_SCOTIA = "Nova Scotia",
  NUNAVUT = "Nunavut",
  ONTARIO = "Ontario",
  PRINCE_EDWARD_ISLAND = "Prince Edward Island",
  QUEBEC = "Quebec",
  SASKATCHEWAN = "Saskatchewan",
  YUKON = "Yukon",
}
