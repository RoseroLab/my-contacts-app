import { type Contact } from "@prisma/client";
import { EditContactDialog } from "./EditContactDialog";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface ContactDialogManagerProps {
  editingContact: Contact | null;
  deletingContact: Contact | null;
  onEditOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function ContactDialogManager({
  editingContact,
  deletingContact,
  onEditOpenChange,
  onDeleteOpenChange,
  onEditSuccess,
  onDeleteSuccess,
}: ContactDialogManagerProps) {
  return (
    <>
      {editingContact && (
        <EditContactDialog
          contact={editingContact}
          open={!!editingContact}
          onOpenChange={onEditOpenChange}
          onSuccess={onEditSuccess}
        />
      )}

      <DeleteContactDialog
        contact={deletingContact}
        open={!!deletingContact}
        onOpenChange={onDeleteOpenChange}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}
