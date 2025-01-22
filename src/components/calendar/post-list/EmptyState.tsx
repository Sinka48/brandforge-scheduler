import { EmptyState as BaseEmptyState } from "@/components/ui/empty-state";
import { Plus, Wand2, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostEmptyStateProps {
  onCreatePost?: () => void;
  onCreateCampaign?: () => void;
  onHowItWorks?: () => void;
}

export function EmptyState({ onCreatePost, onCreateCampaign }: PostEmptyStateProps) {
  const navigate = useNavigate();

  return (
    <BaseEmptyState
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
          label: "How it Works",
          onClick: () => navigate("/how-it-works"),
          icon: HelpCircle,
          variant: "secondary"
        },
        {
          label: "AI Campaign",
          onClick: onCreateCampaign,
          icon: Wand2,
          variant: "default",
          badge: "BETA"
        }
      ]}
    />
  );
}