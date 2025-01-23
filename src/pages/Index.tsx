import { Session } from "@supabase/supabase-js";
import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AuthSection } from "@/components/landing/AuthSection";
import { GradientBackground } from "@/components/landing/GradientBackground";

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  if (session) {
    return (
      <Layout session={session}>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="space-y-4">
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
    <div className="relative flex min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="relative flex-1 flex items-center justify-center">
        <div className="max-w-2xl p-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Social Media Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage all your social media content in one place.
          </p>
        </div>
      </div>
      <AuthSection />
    </div>
  );
}