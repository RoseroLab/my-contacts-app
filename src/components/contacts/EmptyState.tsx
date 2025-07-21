import { UsersIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No contacts found",
  description = "Get started by creating your first contact.",
  actionLabel = "Add Contact",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
        <UsersIcon className="text-muted-foreground h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-sm">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
