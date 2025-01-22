import { Campaign } from "@/types/campaign";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { CampaignPosts } from "./CampaignPosts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Trash2, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CampaignManagerProps {
  campaigns: Campaign[];
}

export function CampaignManager({ campaigns: initialCampaigns }: CampaignManagerProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localCampaigns, setLocalCampaigns] = useState(initialCampaigns);

  // Fetch post counts for each campaign
  const { data: postCounts } = useQuery({
    queryKey: ['campaign-post-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('campaign_id, status')
        .in('campaign_id', localCampaigns.map(c => c.id));

      if (error) throw error;

      const counts = data.reduce((acc: Record<string, { total: number; published: number }>, post) => {
        if (!acc[post.campaign_id]) {
          acc[post.campaign_id] = { total: 0, published: 0 };
        }
        acc[post.campaign_id].total++;
        if (post.status === 'published') {
          acc[post.campaign_id].published++;
        }
        return acc;
      }, {});

      return counts;
    },
    enabled: localCampaigns.length > 0
  });

  const handleStatusToggle = async (campaignId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaignId);

      if (error) throw error;

      // Update local state
      setLocalCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });

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
      // First, delete all posts associated with the campaign
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('campaign_id', campaignId);

      if (postsError) throw postsError;

      // Then delete the campaign
      const { error: campaignError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (campaignError) throw campaignError;

      // Update local state
      setLocalCampaigns(prevCampaigns => 
        prevCampaigns.filter(campaign => campaign.id !== campaignId)
      );

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['campaigns'] });

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

  const handleExport = (campaignId: string) => {
    console.log('Export campaign:', campaignId);
    toast({
      title: "Export",
      description: "Export feature coming soon",
    });
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localCampaigns.map((campaign) => (
            <TableRow 
              key={campaign.id}
              className="cursor-pointer hover:bg-muted"
            >
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusToggle(campaign.id, campaign.status);
                  }}
                >
                  {campaign.status === 'active' ? (
                    <PlayCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <PauseCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </Button>
              </TableCell>
              <TableCell onClick={() => setSelectedCampaignId(campaign.id)}>
                {campaign.name}
              </TableCell>
              <TableCell onClick={() => setSelectedCampaignId(campaign.id)}>
                {campaign.description}
              </TableCell>
              <TableCell onClick={() => setSelectedCampaignId(campaign.id)}>
                {postCounts?.[campaign.id] ? (
                  <Badge variant="secondary">
                    {postCounts[campaign.id].published}/{postCounts[campaign.id].total}
                  </Badge>
                ) : (
                  <Badge variant="secondary">0/0</Badge>
                )}
              </TableCell>
              <TableCell onClick={() => setSelectedCampaignId(campaign.id)}>
                {campaign.start_date && format(new Date(campaign.start_date), 'PPP')}
              </TableCell>
              <TableCell onClick={() => setSelectedCampaignId(campaign.id)}>
                {campaign.end_date && format(new Date(campaign.end_date), 'PPP')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(campaign.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(campaign.id);
                    }}
                  >
                    <FileUp className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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