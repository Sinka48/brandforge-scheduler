import { Button } from "@/components/ui/button";
import { Plus, Wand2, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNextPostTimer } from "@/hooks/useNextPostTimer";
import { Badge } from "@/components/ui/badge";

interface CalendarHeaderProps {
  onNewPost: () => void;
  onNewCampaign: () => void;
}

export function CalendarHeader({ onNewPost, onNewCampaign }: CalendarHeaderProps) {
  const { timeLeft, hasUpcomingPosts } = useNextPostTimer();

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {hasUpcomingPosts && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Next post in: {timeLeft}</h2>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <Button
            variant="outline"
            onClick={onNewCampaign}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Campaign
            <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
              BETA
            </Badge>
          </Button>
        </div>
        <div className="hidden sm:block">
          <Button onClick={onNewPost} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
        
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onNewPost}>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNewCampaign}>
                <Wand2 className="h-4 w-4 mr-2" />
                AI Campaign
                <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
                  BETA
                </Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}