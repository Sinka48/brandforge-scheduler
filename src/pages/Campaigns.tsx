import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/types/campaign";

export default function CampaignsPage({ session }: { session: any }) {
  const { data: campaigns } = useQuery({
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
      <div className="space-y-8 p-4 md:p-6">
        <h1 className="text-2xl font-bold">Your Campaigns</h1>
        {/* Campaign manager component will be added here */}
      </div>
    </Layout>
  );
}