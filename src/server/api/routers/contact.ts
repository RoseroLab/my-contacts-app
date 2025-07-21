import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";

// Helper function to add artificial delay for testing loading states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to safely get delay value
const getDelayMs = (): number => {
  console.log("delayed");
  const delayMs = env.TRPC_DELAY_MS;
  return typeof delayMs === "number" ? delayMs : 0;
};

export const contactRouter = createTRPCRouter({
  // Get all contacts with optional search and pagination
  list: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const delayMs = getDelayMs();
      if (delayMs > 0) {
        await delay(delayMs);
      }

      const { search, limit, offset } = input;

      const where = search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" as const } },
              { lastName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { company: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {};

      const [contacts, totalCount] = await Promise.all([
        ctx.db.contact.findMany({
          where,
          orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
          take: limit,
          skip: offset,
        }),
        ctx.db.contact.count({ where }),
      ]);

      return {
        contacts,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0,
      };
    }),

  // Get a single contact by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const delayMs = getDelayMs();
      if (delayMs > 0) {
        await delay(delayMs);
      }

      const contact = await ctx.db.contact.findUnique({
        where: { id: input.id },
      });

      if (!contact) {
        throw new Error("Contact not found");
      }

      return contact;
    }),

  // Create a new contact
  create: publicProcedure
    .input(
      z.object({
        firstName: z
          .string()
          .min(2, "First name must be at least 2 characters")
          .max(100),
        lastName: z
          .string()
          .min(2, "Last name must be at least 2 characters")
          .max(100),
        email: z.string().email("Invalid email address"),
        phone: z
          .string()
          .regex(/^[+]?[\d\s\-()]{10,}$/, "Invalid phone number format")
          .optional()
          .or(z.literal("")),
        company: z
          .string()
          .min(2, "Company name must be at least 2 characters")
          .max(100)
          .optional()
          .or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const delayMs = getDelayMs();
      if (delayMs > 0) {
        await delay(delayMs);
      }

      try {
        const contact = await ctx.db.contact.create({
          data: {
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: input.email.toLowerCase().trim(),
            phone: input.phone?.trim() ?? null,
            company: input.company?.trim() ?? null,
          },
        });

        return contact;
      } catch (error) {
        // Handle unique constraint violation for email
        if (error instanceof Error && error.message.includes("email")) {
          throw new Error("A contact with this email already exists");
        }
        throw new Error("Failed to create contact");
      }
    }),

  // Update an existing contact
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z
          .string()
          .min(2, "First name must be at least 2 characters")
          .max(100),
        lastName: z
          .string()
          .min(2, "Last name must be at least 2 characters")
          .max(100),
        email: z.string().email("Invalid email address"),
        phone: z
          .string()
          .regex(/^[+]?[\d\s\-()]{10,}$/, "Invalid phone number format")
          .optional()
          .or(z.literal("")),
        company: z
          .string()
          .min(2, "Company name must be at least 2 characters")
          .max(100)
          .optional()
          .or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const delayMs = getDelayMs();
      if (delayMs > 0) {
        await delay(delayMs);
      }

      try {
        const contact = await ctx.db.contact.update({
          where: { id: input.id },
          data: {
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            email: input.email.toLowerCase().trim(),
            phone: input.phone?.trim() ?? null,
            company: input.company?.trim() ?? null,
          },
        });

        return contact;
      } catch (error) {
        if (error instanceof Error && error.message.includes("email")) {
          throw new Error("A contact with this email already exists");
        }
        if (error instanceof Error && error.message.includes("not found")) {
          throw new Error("Contact not found");
        }
        throw new Error("Failed to update contact");
      }
    }),

  // Delete a contact
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const delayMs = getDelayMs();
      if (delayMs > 0) {
        await delay(delayMs);
      }

      try {
        await ctx.db.contact.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof Error && error.message.includes("not found")) {
          throw new Error("Contact not found");
        }
        throw new Error("Failed to delete contact");
      }
    }),

  // Get contact statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const delayMs = getDelayMs();
    if (delayMs > 0) {
      await delay(delayMs);
    }

    const [totalContacts, contactsWithPhone, contactsWithCompany] =
      await Promise.all([
        ctx.db.contact.count(),
        ctx.db.contact.count({
          where: { phone: { not: null } },
        }),
        ctx.db.contact.count({
          where: { company: { not: null } },
        }),
      ]);

    return {
      totalContacts,
      contactsWithPhone,
      contactsWithCompany,
      contactsWithoutPhone: totalContacts - contactsWithPhone,
      contactsWithoutCompany: totalContacts - contactsWithCompany,
    };
  }),
});
