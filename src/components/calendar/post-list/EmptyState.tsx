import { EmptyState as BaseEmptyState } from "@/components/ui/empty-state";
import { FileText, Plus } from "lucide-react";

interface PostEmptyStateProps {
  onCreatePost?: () => void;
}

export function EmptyState({ onCreatePost }: PostEmptyStateProps) {
  return (
    <BaseEmptyState
      icon={FileText}
      title="No posts yet"
      description="Create your first post to get started"
      action={onCreatePost ? {
        label: "Create Post",
        onClick: onCreatePost,
        icon: Plus
      } : undefined}
    />
  );
}