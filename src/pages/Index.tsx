import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Session } from "@supabase/supabase-js";
import { BarChart, Calendar as CalendarIcon, Users, Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function IndexPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setHasCheckedSession(true);
      if (!session) {
        navigate('/calendar', { replace: true });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && hasCheckedSession) {
        navigate('/calendar', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, hasCheckedSession]);

  useEffect(() => {
    if (session) {
      fetchAnalytics();
    }
  }, [session]);

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
      icon: CalendarIcon,
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

  // Sample data for the chart - in a real app, this would come from your backend
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
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your social media performance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
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

        <Card>
          <CardHeader>
            <CardTitle>Weekly Post Activity</CardTitle>
            <CardDescription>
              Number of posts scheduled per day this week
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>
                Active platforms: {analytics?.platforms_used || 'None'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect more social media platforms to see their distribution here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest social media updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Start creating and scheduling posts to see your activity here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}