import { CONTACT_CONSTANTS } from "@/constants/contacts";
import { CreateContactDialog } from "./CreateContactDialog";

interface ContactsPageHeaderProps {
  totalContacts?: number;
}

export function ContactsPageHeader({ totalContacts }: ContactsPageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {CONTACT_CONSTANTS.TITLES.PAGE}
          </h1>
          <p className="text-muted-foreground mt-2">
            {totalContacts
              ? CONTACT_CONSTANTS.DESCRIPTIONS.PAGE_WITH_COUNT(totalContacts)
              : CONTACT_CONSTANTS.DESCRIPTIONS.PAGE}
          </p>
        </div>
        <CreateContactDialog />
      </div>
    </div>
  );
}
