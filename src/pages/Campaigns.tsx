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
import { EmptyState } from "@/components/ui/empty-state";

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
          <div className="flex items-center gap-2">
            <Button
              variant="default"
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
        </div>

        {!isLoading && (!campaigns || campaigns.length === 0) ? (
          <EmptyState
            icon={Wand2}
            title="No campaigns yet"
            description="Create your first AI-powered campaign to get started"
            action={{
              label: "AI Campaign",
              onClick: () => setIsCampaignDialogOpen(true),
              icon: Wand2,
              variant: "default",
              badge: "BETA"
            }}
          />
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