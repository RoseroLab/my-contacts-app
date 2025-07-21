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
  const utils = api.useUtils();

  const deleteContactMutation = api.contact.delete.useMutation({
    onMutate: async (deletedContact) => {
      // Cancel outgoing refetches
      await utils.contact.list.cancel();

      // Snapshot the previous value
      const previousContacts = utils.contact.list.getData({
        search: undefined,
        limit: 50,
        offset: 0,
      });

      // Optimistically remove the contact from the cache
      utils.contact.list.setData(
        { search: undefined, limit: 50, offset: 0 },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            contacts: oldData.contacts.filter(
              (c) => c.id !== deletedContact.id,
            ),
            totalCount: oldData.totalCount - 1,
          };
        },
      );

      return { previousContacts, deletedContactId: deletedContact.id };
    },
    onSuccess: async () => {
      await utils.contact.invalidate();
      onOpenChange(false);
      toast.success("Contact deleted successfully!");
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
          <DialogTitle>Delete Contact</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {contact.firstName}{" "}
            {contact.lastName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteContactMutation.isPending}
          >
            {deleteContactMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
