import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  "Schedule your social media posts with ease",
  "Analyze your social media performance",
  "Create engaging content with AI assistance",
  "Manage multiple social media accounts",
  "Track your brand's growth and engagement",
  "Generate beautiful visual content",
  "Optimize your posting schedule",
  "Collaborate with your team seamlessly"
];

const placeholderImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
];

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [bgImage, setBgImage] = useState("");

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

  useEffect(() => {
    // Select a random image from the placeholderImages array
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    setBgImage(placeholderImages[randomIndex]);

    // Rotate features every 5 seconds
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session) {
      navigate('/calendar');
    }
  }, [session, navigate]);

  // If user is not authenticated, show landing page
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left side - Login form */}
        <div className="w-1/2 p-8 flex items-center justify-center bg-background">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to manage your social media presence</p>
            </div>
            <LoginForm />
          </div>
        </div>

        {/* Right side - Landing content */}
        <div 
          className="w-1/2 relative overflow-hidden"
          style={{
            backgroundImage: bgImage ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bgImage})` : 'none',
            backgroundColor: !bgImage ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 space-y-6">
              <h1 className="text-4xl font-bold text-white mb-4">
                Social Media Management Made Simple
              </h1>
              <div className="h-20 flex items-center justify-center">
                <p className="text-xl text-white animate-fade-in">
                  {features[currentFeature]}
                </p>
              </div>
            </div>
          </div>
        </div>
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