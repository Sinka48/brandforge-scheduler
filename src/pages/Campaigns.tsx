import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";
import { CampaignManager } from "@/components/campaign/CampaignManager";

export default function CampaignsPage({ session }: { session: any }) {
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

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns
          </p>
        </div>
        <CampaignManager campaigns={campaigns || []} />
      </div>
    </Layout>
  );
}