import { Layout } from "@/components/layout/Layout";
import { CampaignManager } from "@/components/campaign/CampaignManager";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface CampaignsPageProps {
  session: Session;
}

export default function CampaignsPage({ session }: CampaignsPageProps) {
  const { data: campaigns } = useQuery({
    queryKey: ['campaigns', session.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout session={session}>
      <div className="space-y-8 p-4 md:p-6">
        <h1 className="text-2xl font-bold">Your Campaigns</h1>
        <CampaignManager campaigns={campaigns || []} />
      </div>
    </Layout>
  );
}
