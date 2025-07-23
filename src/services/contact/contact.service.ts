import { IContact } from "@/types/contact/contact.types";
import { ContactModel } from "@/models/contact/contact.model";
import { dbConnect } from "@/lib/database/db";

/**
 * Contact service for managing contact form submissions.
 *
 * @remarks
 * This service provides methods for creating and retrieving contact form submissions.
 * It handles database connections and error management for contact-related operations.
 */
export class ContactService {
  /**
   * Creates a new contact form submission.
   *
   * @param contactData - The contact form data to save
   * @returns Promise resolving to the created contact document
   *
   * @example
   * ```ts
   * const contact = await ContactService.createContact({
   *   fullName: "John Doe",
   *   email: "john@example.com",
   *   userType: "seller",
   *   query: "I need help with my campaign setup."
   * });
   * ```
   */
  static async createContact(contactData: Omit<IContact, "_id" | "createdAt" | "updatedAt">): Promise<IContact> {
    try {
      await dbConnect();
      
      const contact = new ContactModel(contactData);
      const savedContact = await contact.save();
      
      return savedContact.toObject();
    } catch (error) {
      console.error("Error creating contact:", error);
      throw new Error("Failed to create contact submission");
    }
  }

  /**
   * Retrieves all contact submissions.
   *
   * @param limit - Maximum number of contacts to retrieve (default: 100)
   * @param skip - Number of contacts to skip for pagination (default: 0)
   * @returns Promise resolving to an array of contact documents
   *
   * @example
   * ```ts
   * const contacts = await ContactService.getAllContacts(10, 0);
   * ```
   */
  static async getAllContacts(limit: number = 100, skip: number = 0): Promise<IContact[]> {
    try {
      await dbConnect();
      
      const contacts = await ContactModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();
      
      return contacts;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw new Error("Failed to fetch contact submissions");
    }
  }

  /**
   * Retrieves a contact submission by ID.
   *
   * @param contactId - The ID of the contact submission to retrieve
   * @returns Promise resolving to the contact document or null if not found
   *
   * @example
   * ```ts
   * const contact = await ContactService.getContactById("605c72ef8e8b5c001f5e4d5a");
   * ```
   */
  static async getContactById(contactId: string): Promise<IContact | null> {
    try {
      await dbConnect();
      
      const contact = await ContactModel.findById(contactId).lean();
      return contact;
    } catch (error) {
      console.error("Error fetching contact by ID:", error);
      throw new Error("Failed to fetch contact submission");
    }
  }
}