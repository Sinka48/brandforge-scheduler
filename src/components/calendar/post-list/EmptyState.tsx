import { EmptyState as BaseEmptyState } from "@/components/ui/empty-state";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostEmptyStateProps {
  onCreatePost?: () => void;
}

export function EmptyState({ onCreatePost }: PostEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <BaseEmptyState
      title="No posts yet"
      description="Create your first post to get started"
      action={onCreatePost ? {
        label: "Create Post",
        onClick: onCreatePost,
        icon: HelpCircle,
        variant: "secondary"
      } : undefined}
      additionalActions={[
        {
          label: "How it Works",
          onClick: () => navigate("/how-it-works"),
          icon: HelpCircle,
          variant: "secondary"
        }
      ]}
    />
  );
}