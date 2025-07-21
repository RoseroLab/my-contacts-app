import { type Contact } from "@prisma/client";
import { ContactsTable } from "./ContactsTable";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { CreateContactDialog } from "./CreateContactDialog";
import { CONTACT_CONSTANTS } from "@/constants/contacts";

interface ContactsContentProps {
  contacts?: Contact[];
  isLoading: boolean;
  search: string;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactsContent({
  contacts,
  isLoading,
  search,
  onEdit,
  onDelete,
}: ContactsContentProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!contacts?.length) {
    return (
      <div className="space-y-4">
        <EmptyState
          title={
            search
              ? CONTACT_CONSTANTS.DESCRIPTIONS.NO_CONTACTS_FOUND
              : CONTACT_CONSTANTS.DESCRIPTIONS.NO_CONTACTS
          }
          description={
            search
              ? CONTACT_CONSTANTS.DESCRIPTIONS.EMPTY_SEARCH(search)
              : CONTACT_CONSTANTS.DESCRIPTIONS.EMPTY_STATE
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
    <ContactsTable contacts={contacts} onEdit={onEdit} onDelete={onDelete} />
  );
}
