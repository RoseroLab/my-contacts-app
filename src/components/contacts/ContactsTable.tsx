"use client";

import { type Contact } from "@prisma/client";
import { PencilIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactsTableProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  isDeleting?: boolean;
}

export function ContactsTable({
  contacts,
  onEdit,
  onDelete,
  isDeleting = false,
}: ContactsTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                {contact.firstName} {contact.lastName}
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {contact.phone ? (
                  <span>{contact.phone}</span>
                ) : (
                  <span className="text-muted-foreground">No phone</span>
                )}
              </TableCell>
              <TableCell>
                {contact.company ? (
                  <span>{contact.company}</span>
                ) : (
                  <span className="text-muted-foreground">No company</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(contact.createdAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(contact)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit contact</TooltipContent>
                    </Tooltip>
                  )}

                  {onDelete && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeleting}
                          onClick={() => onDelete(contact)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete contact</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
