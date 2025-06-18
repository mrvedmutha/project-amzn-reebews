import { Schema, Types } from "mongoose";
import { Cart } from "@/types/cart/cart.types";
import { UserPlan } from "@/enums/users/user-plan.enum";

export const CartSchema = new Schema<Cart>(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },
    userDetails: {
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
      company: {
        type: String,
        trim: true,
      },
      gstNumber: {
        type: String,
        trim: true,
        match: [
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Please enter a valid GST number",
        ],
      },
    },
    planDetails: {
      plan: {
        type: String,
        required: true,
        enum: Object.values(UserPlan),
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        required: true,
        enum: ["USD", "INR"],
      },
    },
    paymentGateway: {
      type: String,
      required: true,
      enum: ["razorpay", "paypal"],
    },
    paymentId: {
      type: String,
      trim: true,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "INR"],
    },
    purchaseDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    signupToken: {
      type: String,
      index: true,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
