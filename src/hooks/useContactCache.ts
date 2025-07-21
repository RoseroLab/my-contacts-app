import { type Contact } from "@prisma/client";
import { api } from "@/trpc/react";
import {
  DEFAULT_CONTACT_QUERY,
  type ContactFormData,
} from "@/constants/contacts";

// Type for the contact list query result
type ContactListResult =
  | {
      contacts: Contact[];
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  | undefined;

export const useContactCache = () => {
  const utils = api.useUtils();

  const invalidateContacts = async () => {
    await utils.contact.invalidate();
  };

  const cancelOutgoingRefetches = async () => {
    await utils.contact.list.cancel();
  };

  const getContactsData = () => {
    return utils.contact.list.getData(DEFAULT_CONTACT_QUERY);
  };

  const setContactsData = (
    updater: (oldData: ContactListResult) => ContactListResult,
  ) => {
    utils.contact.list.setData(DEFAULT_CONTACT_QUERY, updater);
  };

  const optimisticCreate = async (newContact: ContactFormData) => {
    await cancelOutgoingRefetches();

    // Create optimistic contact with temporary ID
    const optimisticContact: Contact = {
      id: Date.now(), // Temporary ID
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      email: newContact.email,
      phone: newContact.phone ?? null,
      company: newContact.company ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistically update the cache
    setContactsData((oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        contacts: [optimisticContact, ...oldData.contacts],
        totalCount: oldData.totalCount + 1,
      };
    });

    return { optimisticContact };
  };

  const optimisticUpdate = async (
    contact: Contact,
    updatedData: ContactFormData,
  ) => {
    await cancelOutgoingRefetches();

    // Snapshot the previous value
    const previousContacts = getContactsData();

    // Create optimistic updated contact
    const optimisticContact: Contact = {
      ...contact,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      email: updatedData.email,
      phone: updatedData.phone ?? null,
      company: updatedData.company ?? null,
      updatedAt: new Date(),
    };

    // Optimistically update the cache
    setContactsData((oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        contacts: oldData.contacts.map((c) =>
          c.id === contact.id ? optimisticContact : c,
        ),
      };
    });

    return { previousContacts, optimisticContact };
  };

  const optimisticDelete = async (contactId: number) => {
    await cancelOutgoingRefetches();

    // Snapshot the previous value
    const previousContacts = getContactsData();

    // Optimistically remove the contact from the cache
    setContactsData((oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        contacts: oldData.contacts.filter((c) => c.id !== contactId),
        totalCount: oldData.totalCount - 1,
      };
    });

    return { previousContacts, deletedContactId: contactId };
  };

  const revertOptimisticCreate = (optimisticContact: Contact) => {
    setContactsData((oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        contacts: oldData.contacts.filter(
          (contact) => contact.id !== optimisticContact.id,
        ),
        totalCount: oldData.totalCount - 1,
      };
    });
  };

  const revertOptimisticUpdate = (
    previousContacts: ContactListResult,
  ): void => {
    if (previousContacts) {
      setContactsData(() => previousContacts);
    }
  };

  const revertOptimisticDelete = (
    previousContacts: ContactListResult,
  ): void => {
    if (previousContacts) {
      setContactsData(() => previousContacts);
    }
  };

  return {
    invalidateContacts,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
    revertOptimisticCreate,
    revertOptimisticUpdate,
    revertOptimisticDelete,
  };
};
