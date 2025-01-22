import { Button } from "@/components/ui/button";
import { useNextPostTimer } from "@/hooks/useNextPostTimer";
import { Wand2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CalendarHeaderProps {
  onNewPost?: () => void;
  onNewCampaign?: () => void;
  postsCount?: number;
}

export function CalendarHeader({ 
  onNewPost, 
  onNewCampaign,
  postsCount = 0
}: CalendarHeaderProps) {
  const timeLeft = useNextPostTimer();

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        {timeLeft !== "No upcoming posts" && (
          <p className="text-sm text-muted-foreground">
            {timeLeft}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onNewCampaign}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          AI Campaign
          <Badge variant="secondary" className="ml-2">BETA</Badge>
        </Button>
        <Button
          variant="outline"
          onClick={onNewPost}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>
    </div>
  );
}