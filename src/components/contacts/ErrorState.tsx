import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading your contacts. Please try again.",
  actionLabel = "Try again",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center rounded-lg border p-8 text-center">
      <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
        <AlertTriangleIcon className="text-destructive h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-4 max-w-sm text-sm">
        {description}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCwIcon className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
