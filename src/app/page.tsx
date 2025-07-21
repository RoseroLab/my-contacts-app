"use client";

import { useState } from "react";
import { SearchIcon, RefreshCw } from "lucide-react";
import { type Contact } from "@prisma/client";

import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ContactsTable,
  EmptyState,
  LoadingState,
  ErrorState,
  CreateContactDialog,
  EditContactDialog,
  DeleteContactDialog,
} from "@/components/contacts";

export default function Home() {
  const [search, setSearch] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const utils = api.useUtils();

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleEditSuccess = () => {
    setEditingContact(null);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Clear all contact-related cache
      await utils.contact.invalidate();
      // Force a fresh fetch
      await refetch();
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderHeader = () => (
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
  );

  const renderSearchBar = () => (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (!contactsData?.contacts?.length) {
      return (
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
      );
    }

    return (
      <ContactsTable
        contacts={contactsData.contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  };

  const renderContactCount = () => {
    if (!contactsData?.contacts?.length) return null;

    return (
      <div className="text-muted-foreground mt-6 text-sm">
        Showing {contactsData.contacts.length} of {contactsData.totalCount}{" "}
        contacts
        {search && ` matching "${search}"`}
      </div>
    );
  };

  const renderDialogs = () => (
    <>
      {editingContact && (
        <EditContactDialog
          contact={editingContact}
          open={!!editingContact}
          onOpenChange={(open) => !open && setEditingContact(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      <DeleteContactDialog
        contact={deletingContact}
        open={!!deletingContact}
        onOpenChange={(open) => !open && setDeletingContact(null)}
      />
    </>
  );

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
          {renderHeader()}
          {renderSearchBar()}
          {renderContent()}
          {renderContactCount()}
          {renderDialogs()}
        </div>
      </div>
    </main>
  );
}
