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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContactsTableProps {
  contacts: Contact[];
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: number) => void;
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
                    <Dialog>
                      <Tooltip>
                        <DialogTrigger asChild>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                        </DialogTrigger>
                        <TooltipContent>Delete contact</TooltipContent>
                      </Tooltip>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Contact</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {contact.firstName}{" "}
                            {contact.lastName}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <Button
                            variant="destructive"
                            onClick={() => onDelete(contact.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
