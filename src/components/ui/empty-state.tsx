import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, Wand2, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-background/50 rounded-lg animate-fade-in">
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />}
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
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/how-it-works")}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            How it Works
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/campaigns")}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Campaign
            <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
              BETA
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}