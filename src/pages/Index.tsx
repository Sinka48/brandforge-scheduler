import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardPageProps {
  session: Session;
}

export default function DashboardPage({ session }: DashboardPageProps) {
  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Return default values if no data exists
      return data || {
        total_posts: 0,
        posts_this_week: 0,
        active_campaigns: 0,
        avg_engagement_rate: 0,
        platforms_used: ''
      };
    }
  });

  const { data: activityData } = useQuery({
    queryKey: ['activity-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout session={session}>
      <div className="space-y-8 p-4 md:p-6">
        <StatsCards analytics={analytics} />
        <QuickActions />
        <ActivityChart data={activityData || []} />
      </div>
    </Layout>
  );
}
