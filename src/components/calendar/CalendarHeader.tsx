import { Button } from "@/components/ui/button";
import { Calendar, Plus, Wand2 } from "lucide-react";

interface CalendarHeaderProps {
  onNewPost: () => void;
  onNewCampaign: () => void;
}

export function CalendarHeader({ onNewPost, onNewCampaign }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        <h1 className="text-xl font-semibold">Content Calendar</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onNewCampaign}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          AI Campaign
        </Button>
        <Button onClick={onNewPost} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>
    </div>
  );
}