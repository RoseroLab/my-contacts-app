interface ContactsStatsProps {
  currentCount: number;
  totalCount: number;
  search?: string;
}

export function ContactsStats({
  currentCount,
  totalCount,
  search,
}: ContactsStatsProps) {
  if (currentCount === 0) {
    return null;
  }

  return (
    <div className="text-muted-foreground mt-6 text-sm">
      Showing {currentCount} of {totalCount} contacts
      {search && ` matching "${search}"`}
    </div>
  );
}
