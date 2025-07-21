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
    onSuccess: async (contact) => {
      await utils.contact.invalidate();
      onOpenChange(false);
      toast.success(
        `Contact ${contact.firstName} ${contact.lastName} updated successfully!`,
      );
      onSuccess?.();
    },
    onError: (error) => {
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
