import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface CalendarHeaderProps {
  onNewPost: () => void;
}

export function CalendarHeader({ onNewPost }: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
        <p className="text-muted-foreground">
          Plan and schedule your social media content.
        </p>
      </div>
      <Button onClick={onNewPost}>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Post
      </Button>
    </div>
  );
}