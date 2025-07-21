import { SearchIcon, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CONTACT_CONSTANTS } from "@/constants/contacts";

interface ContactsSearchBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
}

export function ContactsSearchBar({
  search,
  onSearchChange,
  onRefresh,
  isLoading,
  isRefreshing,
}: ContactsSearchBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder={CONTACT_CONSTANTS.PLACEHOLDERS.SEARCH}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label={CONTACT_CONSTANTS.LABELS.SEARCH}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading || isRefreshing}
          className="shrink-0"
          aria-label={CONTACT_CONSTANTS.LABELS.REFRESH}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading || isRefreshing ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
    </div>
  );
}
