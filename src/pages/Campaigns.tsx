import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";
import { CampaignManager } from "@/components/campaign/CampaignManager";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AICampaignDialog } from "@/components/calendar/AICampaignDialog";

export default function CampaignsPage({ session }: { session: any }) {
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as Campaign[];
    },
    enabled: !!session?.user?.id,
  });

  const handleGenerateCampaign = (posts: any[]) => {
    // Handle campaign generation
    console.log('Generated posts:', posts);
  };

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage your marketing campaigns
            </p>
          </div>
          <Button
            onClick={() => setIsCampaignDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            AI Campaign
            <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
              BETA
            </Badge>
          </Button>
        </div>

        {!isLoading && (!campaigns || campaigns.length === 0) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-powered campaign to get started
            </p>
            <Button
              onClick={() => setIsCampaignDialogOpen(true)}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Create AI Campaign
              <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                BETA
              </Badge>
            </Button>
          </div>
        ) : (
          <CampaignManager campaigns={campaigns || []} />
        )}

        <AICampaignDialog
          isOpen={isCampaignDialogOpen}
          onOpenChange={setIsCampaignDialogOpen}
          onGenerateCampaign={handleGenerateCampaign}
        />
      </div>
    </Layout>
  );
}