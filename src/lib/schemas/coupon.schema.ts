import mongoose, { Schema, Types } from "mongoose";

const AffiliateDetailsSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Number, required: true }, // percentage
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isAffiliated: { type: Boolean, default: false },
    affilateDetails: { type: AffiliateDetailsSchema, required: false },
    isLimit: { type: Boolean, default: false },
    limit: { type: Number, required: false },
  },
  { timestamps: true }
);

export default CouponSchema;
