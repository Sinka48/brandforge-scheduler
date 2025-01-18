import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  platforms: string[];
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface CampaignManagerProps {
  campaigns: Campaign[];
}

export function CampaignManager({ campaigns }: CampaignManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{campaign.name}</h3>
              {campaign.description && (
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {campaign.status}
                </span>
                <span className="text-xs">
                  {campaign.platforms.join(", ")}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}