"use client";

import { useState } from "react";
import { type Contact } from "@prisma/client";

import {
  ContactsPageHeader,
  ContactsSearchBar,
  ContactsContent,
  ContactsStats,
  ContactDialogManager,
  ErrorState,
} from "@/components/contacts";
import { useContactSearch } from "@/hooks/useContactSearch";
import { CONTACT_CONSTANTS } from "@/constants/contacts";

export default function Home() {
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

  const {
    search,
    setSearch,
    contactsData,
    stats,
    isLoading,
    isRefreshing,
    error,
    handleRefresh,
    refetch,
  } = useContactSearch();

  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleEditSuccess = () => {
    setEditingContact(null);
  };

  const handleEditOpenChange = (open: boolean) => {
    if (!open) setEditingContact(null);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeletingContact(null);
  };

  if (error) {
    return (
      <main className="bg-background min-h-screen">
        <div className="container mx-auto p-8">
          <div className="mx-auto max-w-4xl">
            <ContactsPageHeader />
            <ErrorState
              title={CONTACT_CONSTANTS.MESSAGES.ERRORS.FETCH_FAILED}
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
          <ContactsPageHeader totalContacts={stats?.totalContacts} />

          <ContactsSearchBar
            search={search}
            onSearchChange={setSearch}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
          />

          <ContactsContent
            contacts={contactsData?.contacts}
            isLoading={isLoading}
            search={search}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ContactsStats
            currentCount={contactsData?.contacts?.length ?? 0}
            totalCount={contactsData?.totalCount ?? 0}
            search={search || undefined}
          />

          <ContactDialogManager
            editingContact={editingContact}
            deletingContact={deletingContact}
            onEditOpenChange={handleEditOpenChange}
            onDeleteOpenChange={handleDeleteOpenChange}
            onEditSuccess={handleEditSuccess}
          />
        </div>
      </div>
    </main>
  );
}
