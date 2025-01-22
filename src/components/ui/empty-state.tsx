import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    badge?: string;
  };
  additionalActions?: Array<{
    label: string;
    onClick?: () => void;
    icon?: LucideIcon;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    badge?: string;
  }>;
}

export function EmptyState({
  title,
  description,
  action,
  additionalActions = []
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-background/50 rounded-lg animate-fade-in">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {description}
      </p>
      <div className="space-y-3">
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            className="flex items-center gap-2"
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
            {action.badge && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                {action.badge}
              </Badge>
            )}
          </Button>
        )}
        {additionalActions.length > 0 && (
          <div className="flex gap-2">
            {additionalActions.map((additionalAction, index) => (
              <Button
                key={index}
                variant={additionalAction.variant || "outline"}
                onClick={additionalAction.onClick}
                className="flex items-center gap-2"
              >
                {additionalAction.icon && <additionalAction.icon className="h-4 w-4" />}
                {additionalAction.label}
                {additionalAction.badge && (
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                    {additionalAction.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}