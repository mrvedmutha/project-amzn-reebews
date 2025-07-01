import { Schema, Types } from "mongoose";
import { ICart } from "@/types/cart/cart.types";
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  Currency,
  Plan,
  BillingCycle,
} from "@/enums/checkout.enum";

export const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },
    user: {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
        index: true,
      },
      address: {
        street: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        state: {
          type: String,
          required: true,
          trim: true,
        },
        country: {
          type: String,
          required: true,
          trim: true,
          default: "India",
        },
        pincode: {
          type: String,
          required: true,
          trim: true,
          match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
        },
      },
      business: {
        company: {
          type: String,
          trim: true,
        },
        gstin: {
          type: String,
          trim: true,
          match: [
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Please enter a valid GST number",
          ],
        },
      },
    },
    subscription: {
      plan: {
        type: Types.ObjectId,
        ref: "Plan",
        required: true,
      },
      planAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      planCurrency: {
        type: String,
        required: true,
        enum: Object.values(Currency),
      },
      isActive: {
        type: Boolean,
        required: true,
        default: true,
        index: true, // Index for querying active subscriptions
      },
      startDate: {
        type: Date,
        index: true, // Index for querying active subscriptions
        validate: {
          validator: function (this: any, value: Date) {
            // startDate should not be in the future for completed subscriptions
            if (
              this.parent().payment?.status === "completed" &&
              value &&
              value > new Date()
            ) {
              return false;
            }
            return true;
          },
          message:
            "Start date cannot be in the future for completed subscriptions",
        },
      },
      endDate: {
        type: Date,
        default: null, // null for free plans that never expire
        index: true, // Index for querying expiring subscriptions
        validate: {
          validator: function (this: any, value: Date | null) {
            const startDate = this.startDate;

            // If endDate is set, it should be after startDate
            if (value && startDate && value <= startDate) {
              return false;
            }

            return true;
          },
          message:
            "End date must be after start date, null for free plans, and set for paid plans after completion",
        },
      },
    },
    billingCycle: {
      type: String,
      required: true,
      enum: Object.values(BillingCycle),
    },
    payment: {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      method: {
        type: String,
        required: true,
        enum: Object.values(PaymentGateway),
      },
      paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
      },
      transactionId: {
        type: String,
        trim: true,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        enum: Object.values(Currency),
      },
      status: {
        type: String,
        required: true,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
        index: true,
      },
    },
    coupon: {
      type: Types.ObjectId,
      ref: "Coupon",
    },
    discountAmount: {
      type: Number,
      min: 0,
    },
    signupToken: {
      type: String,
      index: true,
    },
    tokenExpiry: {
      type: Date,
    },
    isSignupCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
