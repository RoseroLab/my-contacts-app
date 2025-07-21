import { Separator } from "@/components/ui/separator";

export function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          </div>
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-4 w-28 animate-pulse rounded" />
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                <div className="flex space-x-1">
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                  <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                </div>
              </div>
            </div>
            {index < 4 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingTableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-4 w-full animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
