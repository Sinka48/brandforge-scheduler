import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { LoginForm } from "@/components/auth/LoginForm";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityChart } from "@/components/dashboard/ActivityChart";

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  if (!session) {
    return <LoginForm />;
  }

  return (
    <Layout session={session}>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your social media performance.
          </p>
        </div>

        <StatsCards />
        
        <div className="grid gap-8 md:grid-cols-2">
          <QuickActions />
          <ActivityChart />
        </div>
      </div>
    </Layout>
  );
}