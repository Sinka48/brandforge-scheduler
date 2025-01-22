import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Users, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function StatsCards() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Fetching analytics for user:', session.user.id);

      // First, ensure the analytics record exists
      const { error: rpcError } = await supabase.rpc('ensure_dashboard_analytics_exists', {
        input_user_id: session.user.id
      });

      if (rpcError) {
        console.error('Error ensuring analytics exists:', rpcError);
        throw rpcError;
      }

      // Manually calculate current stats to ensure accuracy
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get total posts count
      const { count: totalPosts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // Get posts this week count
      const { count: postsThisWeek } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('scheduled_for', weekAgo.toISOString());

      // Get active campaigns count
      const { count: activeCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .lte('start_date', now.toISOString())
        .or(`end_date.gt.${now.toISOString()},end_date.is.null`);

      // Get average engagement rate
      const { data: postAnalytics } = await supabase
        .from('post_analytics')
        .select('engagement_rate')
        .gt('engagement_rate', 0);

      const avgEngagementRate = postAnalytics?.length 
        ? postAnalytics.reduce((sum, post) => sum + Number(post.engagement_rate), 0) / postAnalytics.length 
        : 0;

      console.log('Calculated analytics:', {
        totalPosts,
        postsThisWeek,
        activeCampaigns,
        avgEngagementRate
      });

      return {
        total_posts: totalPosts || 0,
        posts_this_week: postsThisWeek || 0,
        active_campaigns: activeCampaigns || 0,
        avg_engagement_rate: avgEngagementRate || 0
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = [
    {
      name: "Total Posts",
      value: analytics?.total_posts || 0,
      icon: BarChart,
      description: "Total posts created"
    },
    {
      name: "Posts This Week",
      value: analytics?.posts_this_week || 0,
      icon: Calendar,
      description: "Posts scheduled this week"
    },
    {
      name: "Active Campaigns",
      value: analytics?.active_campaigns || 0,
      icon: Users,
      description: "Currently running campaigns"
    },
    {
      name: "Engagement Rate",
      value: `${(analytics?.avg_engagement_rate || 0).toFixed(2)}%`,
      icon: Activity,
      description: "Average engagement across platforms"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.name}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}