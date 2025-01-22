import { Campaign } from "@/types/campaign";
import { useState } from "react";
import { CampaignPosts } from "./CampaignPosts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/ui/empty-state";
import { CampaignTable } from "./CampaignTable";
import { useCampaignData } from "./useCampaignData";

interface CampaignManagerProps {
  campaigns: Campaign[];
}

export function CampaignManager({ campaigns: initialCampaigns }: CampaignManagerProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { localCampaigns, setLocalCampaigns, postCounts, isLoading } = useCampaignData(initialCampaigns);

  const handleStatusToggle = async (campaignId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) throw error;

      setLocalCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );

      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Success",
        description: `Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully`,
      });
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (campaignId: string) => {
    try {
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('campaign_id', campaignId);

      if (postsError) throw postsError;

      const { error: campaignError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (campaignError) throw campaignError;

      setLocalCampaigns(prevCampaigns => 
        prevCampaigns.filter(campaign => campaign.id !== campaignId)
      );

      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: "Success",
        description: "Campaign and associated posts deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  if (!isLoading && (!localCampaigns || localCampaigns.length === 0)) {
    return (
      <EmptyState
        icon={Wand2}
        title="No campaigns yet"
        description="Create your first AI-powered campaign to get started"
        action={{
          label: "Create AI Campaign",
          onClick: () => setSelectedCampaignId(null),
          variant: "secondary",
          icon: Wand2,
          badge: "BETA"
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CampaignTable
        campaigns={localCampaigns}
        postCounts={postCounts || {}}
        onStatusToggle={handleStatusToggle}
        onDelete={handleDelete}
        onCampaignSelect={setSelectedCampaignId}
      />

      <Dialog open={!!selectedCampaignId} onOpenChange={() => setSelectedCampaignId(null)}>
        <DialogContent className="max-w-4xl">
          <div className="py-6">
            <h2 className="text-2xl font-bold mb-4">Campaign Posts</h2>
            {selectedCampaignId && <CampaignPosts campaignId={selectedCampaignId} />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}