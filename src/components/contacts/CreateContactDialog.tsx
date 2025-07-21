"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";
import { useContactCache } from "@/hooks/useContactCache";
import { CONTACT_CONSTANTS, type ContactFormData } from "@/constants/contacts";

interface CreateContactDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateContactDialog({
  onSuccess,
  trigger,
}: CreateContactDialogProps) {
  const [open, setOpen] = useState(false);
  const { invalidateContacts, optimisticCreate, revertOptimisticCreate } =
    useContactCache();

  const createContactMutation = api.contact.create.useMutation({
    onMutate: optimisticCreate,
    onSuccess: async (contact) => {
      await invalidateContacts();
      setOpen(false);
      toast.success(
        CONTACT_CONSTANTS.MESSAGES.SUCCESS.CREATED(
          contact.firstName,
          contact.lastName,
        ),
      );
      onSuccess?.();
    },
    onError: (error, _variables, context) => {
      if (context?.optimisticContact) {
        revertOptimisticCreate(context.optimisticContact);
      }
      toast.error(error.message);
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    createContactMutation.mutate(data);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <PlusIcon className="h-4 w-4" />
      {CONTACT_CONSTANTS.LABELS.ADD_CONTACT}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{CONTACT_CONSTANTS.TITLES.CREATE_DIALOG}</DialogTitle>
          <DialogDescription>
            {CONTACT_CONSTANTS.DESCRIPTIONS.CREATE_DIALOG}
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createContactMutation.isPending}
          submitLabel={CONTACT_CONSTANTS.BUTTONS.CREATE}
        />
        {createContactMutation.error && (
          <div className="bg-destructive/15 rounded-md p-3">
            <p className="text-destructive text-sm">
              {createContactMutation.error.message}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
