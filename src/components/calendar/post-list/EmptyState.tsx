import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <AlertCircle className="h-12 w-12 opacity-50" />
        <p>No posts scheduled for this date</p>
      </div>
      <Button variant="outline" size="sm">
        Create your first post
      </Button>
    </div>
  );
}