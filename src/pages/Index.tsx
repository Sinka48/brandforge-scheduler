import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const [showLogin, setShowLogin] = useState(true);

  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data || {
        total_posts: 0,
        posts_this_week: 0,
        active_campaigns: 0,
        avg_engagement_rate: 0,
        platforms_used: ''
      };
    },
    enabled: !!session?.user?.id
  });

  // If user is not authenticated, show landing page
  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container flex h-14 items-center justify-between">
            <span className="text-xl font-bold">Brand Management</span>
            <div className="flex gap-4">
              <Button 
                variant={showLogin ? "default" : "outline"}
                onClick={() => setShowLogin(true)}
              >
                Login
              </Button>
              <Button 
                variant={!showLogin ? "default" : "outline"}
                onClick={() => setShowLogin(false)}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">
                Manage Your Brand Presence
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your social media management, create engaging campaigns, and grow your brand presence across all platforms.
              </p>
            </div>

            <Card className="p-6">
              {showLogin ? <LoginForm /> : <SignUpForm />}
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Layout session={session}>
      <div className="space-y-8 p-4 md:p-6">
        <StatsCards analytics={analytics} />
        <QuickActions />
      </div>
    </Layout>
  );
}