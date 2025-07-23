import { Schema } from "mongoose";
import { IContact } from "@/types/contact/contact.types";

export const ContactSchema = new Schema<IContact>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    userType: {
      type: String,
      required: true,
      enum: ["buyer", "seller"],
    },
    query: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
  },
  { timestamps: true, versionKey: false }
);