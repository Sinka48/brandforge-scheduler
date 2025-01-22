import { Button } from "@/components/ui/button";
import { useNextPostTimer } from "@/hooks/useNextPostTimer";
import { Wand2 } from "lucide-react";
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
        <h1 className="text-2xl font-bold">Calendar</h1>
        {postsCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Next post {timeLeft}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onNewPost}
        >
          Create Post
        </Button>
        <Button
          onClick={onNewCampaign}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          AI Campaign
          <Badge variant="secondary" className="ml-2">BETA</Badge>
        </Button>
      </div>
    </div>
  );
}