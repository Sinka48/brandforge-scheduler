import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Users, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function StatsCards() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      // Force refresh analytics before fetching
      await supabase.rpc('ensure_dashboard_analytics_exists', {
        input_user_id: session.user.id
      });
      
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data;
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