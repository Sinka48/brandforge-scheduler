
import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthSection } from "@/components/landing/AuthSection";
import { FeaturesAnimation } from "@/components/landing/FeaturesAnimation";
import { GradientBackground } from "@/components/landing/GradientBackground";
import { QuickActions } from "@/components/dashboard/QuickActions";

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // Force refresh analytics before fetching
      await supabase.rpc('ensure_dashboard_analytics_exists', {
        input_user_id: session.user.id
      });
      
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
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
