import { useState } from "react";
import { api } from "@/trpc/react";
import { useContactCache } from "./useContactCache";
import { DEFAULT_CONTACT_QUERY } from "@/constants/contacts";

export const useContactSearch = () => {
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { invalidateContacts } = useContactCache();

  const {
    data: contactsData,
    isLoading,
    error,
    refetch,
  } = api.contact.list.useQuery({
    search: search || DEFAULT_CONTACT_QUERY.search,
    limit: DEFAULT_CONTACT_QUERY.limit,
    offset: DEFAULT_CONTACT_QUERY.offset,
  });

  const { data: stats } = api.contact.getStats.useQuery();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Clear all contact-related cache
      await invalidateContacts();
      // Force a fresh fetch
      await refetch();
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return {
    // Search state
    search,
    setSearch,
    clearSearch,

    // Data
    contactsData,
    stats,

    // Loading states
    isLoading,
    isRefreshing,

    // Error state
    error,

    // Actions
    handleRefresh,
    refetch,
  };
};
