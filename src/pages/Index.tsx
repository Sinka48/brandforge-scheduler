import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Session } from "@supabase/supabase-js";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function IndexPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          if (currentSession && window.location.pathname === '/') {
            fetchAnalytics();
          }
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setError("Failed to initialize authentication");
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted && isInitialized) {
        setSession(newSession);
        if (newSession) {
          fetchAnalytics();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, isInitialized]);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_analytics')
        .select('*')
        .single();

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  const chartData = [
    { name: 'Mon', posts: 4 },
    { name: 'Tue', posts: 3 },
    { name: 'Wed', posts: 5 },
    { name: 'Thu', posts: 2 },
    { name: 'Fri', posts: 6 },
    { name: 'Sat', posts: 4 },
    { name: 'Sun', posts: 3 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h2>
          <p className="text-muted-foreground">
            Here's an overview of your social media performance
          </p>
        </div>

        <StatsCards analytics={analytics} />
        
        <QuickActions />
        
        <ActivityChart data={chartData} />
      </div>
    </Layout>
  );
}