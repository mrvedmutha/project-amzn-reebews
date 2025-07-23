import mongoose from "mongoose";
import { IContact } from "@/types/contact/contact.types";
import { ContactSchema } from "@/schemas/contact/contact.schema";

/**
 * Contact model for managing contact form submissions.
 *
 * @remarks
 * This model defines the structure of contact form submissions, including
 * user information, query details, and metadata. It uses the {@link ContactSchema}
 * to enforce data consistency and validation.
 *
 * @example
 * Creating a new contact submission:
 * ```ts
 * const contact = new ContactModel({
 *   fullName: "John Doe",
 *   email: "john@example.com",
 *   userType: "seller",
 *   query: "I need help with setting up my first campaign."
 * });
 * await contact.save();
 * ```
 *
 * @example
 * Fetching recent contact submissions:
 * ```ts
 * const recentContacts = await ContactModel.find()
 *   .sort({ createdAt: -1 })
 *   .limit(10);
 * ```
 */
export const ContactModel =
  (mongoose.models.Contact as mongoose.Model<IContact>) ||
  mongoose.model<IContact>("Contact", ContactSchema);