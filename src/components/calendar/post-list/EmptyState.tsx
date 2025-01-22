import { FileText } from "lucide-react";
import { EmptyState as BaseEmptyState } from "@/components/ui/empty-state";

export function EmptyState() {
  return (
    <BaseEmptyState
      icon={FileText}
      title="No posts found"
      description="There are no posts scheduled for this date."
    />
  );
}