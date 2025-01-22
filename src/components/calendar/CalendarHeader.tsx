import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CalendarHeaderProps {
  onCreatePost: () => void;
}

export function CalendarHeader({ onCreatePost }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
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