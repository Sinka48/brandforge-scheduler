import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  title = "No posts yet",
  description = "Create your first post to get started.",
  action,
  actionLabel = "Create Post"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {action && (
        <Button onClick={action} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}