export interface IContact {
  _id?: string;
  fullName: string;
  email: string;
  userType: "buyer" | "seller";
  query: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactFormData {
  fullName: string;
  email: string;
  userType: "buyer" | "seller" | "";
  query: string;
}

export interface IContactFormErrors {
  fullName?: string;
  email?: string;
  userType?: string;
  query?: string;
}

export interface IContactSubmissionRequest {
  fullName: string;
  email: string;
  userType: "buyer" | "seller";
  query: string;
  recaptchaToken: string;
}

export interface IContactSubmissionResponse {
  success: boolean;
  message: string;
  contactId?: string;
}