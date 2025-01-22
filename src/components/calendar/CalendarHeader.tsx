import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNextPostTimer } from "@/hooks/useNextPostTimer";

interface CalendarHeaderProps {
  onCreatePost?: () => void;
}

export function CalendarHeader({ onCreatePost }: CalendarHeaderProps) {
  const nextPostTime = useNextPostTimer();

  return (
    <div className="flex items-center justify-between">
      {nextPostTime && (
        <p className="text-sm text-muted-foreground">
          {nextPostTime}
        </p>
      )}
      <div className="flex items-center justify-end">
        <Button
          onClick={onCreatePost}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>
    </div>
  );
}