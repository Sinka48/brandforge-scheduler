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
          <StatsCards />
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