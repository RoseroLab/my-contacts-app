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
import { ContactForm, type ContactFormData } from "./ContactForm";

interface CreateContactDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateContactDialog({
  onSuccess,
  trigger,
}: CreateContactDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const createContactMutation = api.contact.create.useMutation({
    onSuccess: async (contact) => {
      await utils.contact.invalidate();
      setOpen(false);
      toast.success(
        `Contact ${contact.firstName} ${contact.lastName} created successfully!`,
      );
      onSuccess?.();
    },
    onError: (error) => {
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
      Add Contact
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to your directory. Fill in the required fields and
            any optional information.
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={createContactMutation.isPending}
          submitLabel="Create Contact"
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
