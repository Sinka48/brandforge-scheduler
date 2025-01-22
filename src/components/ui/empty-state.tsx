import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
    icon?: LucideIcon;
    badge?: string;
  };
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-background/50 rounded-lg border border-dashed animate-fade-in">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />}
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "secondary"}
          className="flex items-center gap-2"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
          {action.badge && (
            <span className="ml-1 text-[10px] px-1 py-0 bg-primary/10 rounded">
              {action.badge}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}