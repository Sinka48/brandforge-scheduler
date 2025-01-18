import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No posts found</h3>
      <p className="text-muted-foreground">
        There are no posts scheduled for this date.
      </p>
    </div>
  );
}