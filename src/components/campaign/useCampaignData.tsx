import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function useCampaignData(initialCampaigns: Campaign[]) {
  const [localCampaigns, setLocalCampaigns] = useState(initialCampaigns);
  const { toast } = useToast();

  const { data: postCounts, isLoading } = useQuery({
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

  return {
    localCampaigns,
    setLocalCampaigns,
    postCounts,
    isLoading
  };
}