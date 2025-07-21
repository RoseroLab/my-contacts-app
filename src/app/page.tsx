"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { type Contact } from "@prisma/client";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import {
  ContactsTable,
  EmptyState,
  LoadingState,
  ErrorState,
  CreateContactDialog,
  EditContactDialog,
} from "@/components/contacts";

export default function Home() {
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = api.contact.list.useQuery({
    search: search || undefined,
    limit: 50,
    offset: 0,
  });

  const { data: stats } = api.contact.getStats.useQuery();

  const deleteContactMutation = api.contact.delete.useMutation({
    onSuccess: () => {
      void refetch();
      toast.success("Contact deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (contactId: number) => {
    deleteContactMutation.mutate({ id: contactId });
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleEditSuccess = () => {
    setEditingContact(null);
  };

  if (error) {
    return (
      <main className="bg-background min-h-screen">
        <div className="container mx-auto p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">My Contacts</h1>
              <p className="text-muted-foreground mt-2">
                Manage your contacts efficiently
              </p>
            </div>
            <ErrorState
              title="Failed to load contacts"
              description={error.message}
              onRetry={() => refetch()}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Contacts</h1>
                <p className="text-muted-foreground mt-2">
                  {stats?.totalContacts
                    ? `Manage your ${stats.totalContacts} contacts efficiently`
                    : "Manage your contacts efficiently"}
                </p>
              </div>
              <CreateContactDialog />
            </div>
          </div>

          <div className="mb-6">
            <div className="relative max-w-sm">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : !contactsData?.contacts?.length ? (
            <div className="space-y-4">
              <EmptyState
                title={search ? "No contacts found" : "No contacts yet"}
                description={
                  search
                    ? `No contacts match "${search}". Try a different search term.`
                    : "Get started by creating your first contact."
                }
              />
              {!search && (
                <div className="flex justify-center">
                  <CreateContactDialog />
                </div>
              )}
            </div>
          ) : (
            <ContactsTable
              contacts={contactsData.contacts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deleteContactMutation.isPending}
            />
          )}

          {contactsData?.contacts?.length && (
            <div className="text-muted-foreground mt-6 text-sm">
              Showing {contactsData.contacts.length} of{" "}
              {contactsData.totalCount} contacts
              {search && ` matching "${search}"`}
            </div>
          )}

          {editingContact && (
            <EditContactDialog
              contact={editingContact}
              open={!!editingContact}
              onOpenChange={(open) => !open && setEditingContact(null)}
              onSuccess={handleEditSuccess}
            />
          )}
        </div>
      </div>
    </main>
  );
}
