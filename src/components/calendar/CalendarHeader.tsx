import { Button } from "@/components/ui/button";
import { Plus, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AICampaignDialog } from "./AICampaignDialog";

interface CalendarHeaderProps {
  onCreatePost: () => void;
}

export function CalendarHeader({ onCreatePost }: CalendarHeaderProps) {
  const [isAICampaignOpen, setIsAICampaignOpen] = useState(false);

  const handleGenerateCampaign = (posts: any[]) => {
    console.log('Generated posts:', posts);
  };

  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-2">
        <Button 
          variant="default"
          onClick={() => setIsAICampaignOpen(true)}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          AI Campaign
          <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
            BETA
          </Badge>
        </Button>
        <Button
          variant="outline"
          onClick={onCreatePost}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      <AICampaignDialog
        isOpen={isAICampaignOpen}
        onOpenChange={setIsAICampaignOpen}
        onGenerateCampaign={handleGenerateCampaign}
      />
    </div>
  );
}