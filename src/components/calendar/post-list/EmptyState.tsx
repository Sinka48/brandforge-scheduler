import { EmptyState as BaseEmptyState } from "@/components/ui/empty-state";
import { FileText, Plus, Sparkles, HelpCircle } from "lucide-react";

interface PostEmptyStateProps {
  onCreatePost?: () => void;
  onCreateCampaign?: () => void;
  onHowItWorks?: () => void;
}

export function EmptyState({ onCreatePost, onCreateCampaign, onHowItWorks }: PostEmptyStateProps) {
  return (
    <BaseEmptyState
      icon={FileText}
      title="No posts yet"
      description="Create your first post to get started"
      action={onCreatePost ? {
        label: "Create Post",
        onClick: onCreatePost,
        icon: Plus,
        variant: "secondary"
      } : undefined}
      additionalActions={[
        {
          label: "AI Campaign",
          onClick: onCreateCampaign,
          icon: Sparkles,
          variant: "default",
          badge: "BETA"
        },
        {
          label: "How it Works",
          onClick: onHowItWorks,
          icon: HelpCircle,
          variant: "outline"
        }
      ]}
    />
  );
}