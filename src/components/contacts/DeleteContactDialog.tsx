"use client";

import { type Contact } from "@prisma/client";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContactCache } from "@/hooks/useContactCache";
import { CONTACT_CONSTANTS } from "@/constants/contacts";

interface DeleteContactDialogProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteContactDialog({
  contact,
  open,
  onOpenChange,
  onSuccess,
}: DeleteContactDialogProps) {
  const { invalidateContacts, optimisticDelete, revertOptimisticDelete } =
    useContactCache();

  const deleteContactMutation = api.contact.delete.useMutation({
    onMutate: async (deletedContact) => {
      return await optimisticDelete(deletedContact.id);
    },
    onSuccess: async () => {
      await invalidateContacts();
      onOpenChange(false);
      toast.success(CONTACT_CONSTANTS.MESSAGES.SUCCESS.DELETED);
      onSuccess?.();
    },
    onError: (error, _variables, context) => {
      if (context?.previousContacts) {
        revertOptimisticDelete(context.previousContacts);
      }
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    if (!contact) return;
    deleteContactMutation.mutate({ id: contact.id });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!contact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTACT_CONSTANTS.TITLES.DELETE_DIALOG}</DialogTitle>
          <DialogDescription>
            {CONTACT_CONSTANTS.DESCRIPTIONS.DELETE_DIALOG(
              contact.firstName,
              contact.lastName,
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {CONTACT_CONSTANTS.BUTTONS.CANCEL}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteContactMutation.isPending}
          >
            {deleteContactMutation.isPending
              ? CONTACT_CONSTANTS.BUTTONS.DELETING
              : CONTACT_CONSTANTS.BUTTONS.DELETE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
