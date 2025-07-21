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
import { ContactForm } from "./ContactForm";
import { useContactCache } from "@/hooks/useContactCache";
import { CONTACT_CONSTANTS, type ContactFormData } from "@/constants/contacts";

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
  const { invalidateContacts, optimisticUpdate, revertOptimisticUpdate } =
    useContactCache();

  const updateContactMutation = api.contact.update.useMutation({
    onMutate: async (updatedContact) => {
      return await optimisticUpdate(contact, updatedContact);
    },
    onSuccess: async (updatedContact) => {
      await invalidateContacts();
      onOpenChange(false);
      toast.success(
        CONTACT_CONSTANTS.MESSAGES.SUCCESS.UPDATED(
          updatedContact.firstName,
          updatedContact.lastName,
        ),
      );
      onSuccess?.();
    },
    onError: (error, _variables, context) => {
      if (context?.previousContacts) {
        revertOptimisticUpdate(context.previousContacts);
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
          <DialogTitle>{CONTACT_CONSTANTS.TITLES.EDIT_DIALOG}</DialogTitle>
          <DialogDescription>
            {CONTACT_CONSTANTS.DESCRIPTIONS.EDIT_DIALOG(
              contact.firstName,
              contact.lastName,
            )}
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateContactMutation.isPending}
          submitLabel={CONTACT_CONSTANTS.BUTTONS.UPDATE}
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
