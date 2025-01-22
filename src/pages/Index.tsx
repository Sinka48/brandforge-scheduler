import { Session } from "@supabase/supabase-js";
import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";

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

  // Show login form for non-authenticated users
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}