import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthSection } from "@/components/landing/AuthSection";
import { FeaturesAnimation } from "@/components/landing/FeaturesAnimation";
import { GradientBackground } from "@/components/landing/GradientBackground";
import { useToast } from "@/hooks/use-toast";

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const { toast } = useToast();

  const { data: analytics, error } = useQuery({
    queryKey: ['dashboard-analytics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // First ensure analytics exists for user
      const { error: initError } = await supabase
        .rpc('ensure_dashboard_analytics_exists', {
          user_id: session.user.id as string
        });

      if (initError) {
        console.error('Error initializing analytics:', initError);
      }

      // Then fetch the analytics
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error loading dashboard",
          description: "There was a problem loading your analytics data.",
          variant: "destructive",
        });
        throw error;
      }

      return data || {
        total_posts: 0,
        posts_this_week: 0,
        active_campaigns: 0,
        avg_engagement_rate: 0,
        platforms_used: ''
      };
    },
    enabled: !!session?.user?.id,
    retry: 3,
  });

  if (session) {
    return (
      <Layout session={session}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your social media performance.
            </p>
          </div>
          <StatsCards analytics={analytics} />
          <QuickActions />
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AuthSection />
      <div className="w-[60%] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <GradientBackground />
        <FeaturesAnimation />
      </div>
    </div>
  );
}