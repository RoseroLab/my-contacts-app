"use client";

import { type Contact } from "@prisma/client";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm, type ContactFormData } from "./ContactForm";

interface EditContactDialogProps {
  contact: Contact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditContactDialog({
  contact,
  open,
  onOpenChange,
  onSuccess,
}: EditContactDialogProps) {
  const utils = api.useUtils();

  const updateContactMutation = api.contact.update.useMutation({
    onMutate: async (updatedContact) => {
      // Cancel outgoing refetches
      await utils.contact.list.cancel();

      // Snapshot the previous value
      const previousContacts = utils.contact.list.getData({
        search: undefined,
        limit: 50,
        offset: 0,
      });

      // Create optimistic updated contact
      const optimisticContact = {
        ...contact,
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        phone: updatedContact.phone ?? null,
        company: updatedContact.company ?? null,
        updatedAt: new Date(),
      };

      // Optimistically update the cache
      utils.contact.list.setData(
        { search: undefined, limit: 50, offset: 0 },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            contacts: oldData.contacts.map((c) =>
              c.id === contact.id ? optimisticContact : c,
            ),
          };
        },
      );

      return { previousContacts, optimisticContact };
    },
    onSuccess: async (contact) => {
      await utils.contact.invalidate();
      onOpenChange(false);
      toast.success(
        `Contact ${contact.firstName} ${contact.lastName} updated successfully!`,
      );
      onSuccess?.();
    },
    onError: (error, _variables, context) => {
      // Revert optimistic update on error
      if (context?.previousContacts) {
        utils.contact.list.setData(
          { search: undefined, limit: 50, offset: 0 },
          context.previousContacts,
        );
      }
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    updateContactMutation.mutate({
      id: contact.id,
      ...data,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update the contact information for {contact.firstName}{" "}
            {contact.lastName}.
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateContactMutation.isPending}
          submitLabel="Update Contact"
        />
        {updateContactMutation.error && (
          <div className="bg-destructive/15 rounded-md p-3">
            <p className="text-destructive text-sm">
              {updateContactMutation.error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
