import { Layout } from "@/components/layout/Layout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "Social Media Calendar",
    description: "Plan and schedule your content across multiple platforms with our intuitive calendar interface.",
    icon: "📅"
  },
  {
    title: "Brand Identity Management",
    description: "Create and maintain consistent brand guidelines, color schemes, and visual assets.",
    icon: "🎨"
  },
  {
    title: "Campaign Analytics",
    description: "Track performance metrics and engagement rates for all your social media campaigns.",
    icon: "📊"
  },
  {
    title: "AI-Powered Content",
    description: "Generate engaging content ideas and captions with our AI assistant.",
    icon: "🤖"
  },
  {
    title: "Multi-Platform Support",
    description: "Manage content for all major social media platforms in one place.",
    icon: "🌐"
  }
];

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    // Fetch random 3D render from Unsplash
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(
          "https://api.unsplash.com/photos/random?query=3d-render&orientation=landscape",
          {
            headers: {
              Authorization: `Client-ID YOUR_UNSPLASH_API_KEY`
            }
          }
        );
        const data = await response.json();
        setBackgroundImage(data.urls.regular);
      } catch (error) {
        console.error("Failed to fetch background image:", error);
        // Fallback image if fetch fails
        setBackgroundImage("https://images.unsplash.com/photo-1633356122544-f134324a6cee");
      }
    };

    fetchRandomImage();
  }, []); // Run once on component mount

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  if (session) {
    return (
      <Layout session={session}>
        <div className="space-y-8 p-4 md:p-6">
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

  // Landing page with 40/60 split
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - 40% */}
      <div className="w-[40%] p-8 flex flex-col items-center justify-center border-r">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">Brand Management</h1>
            <p className="text-muted-foreground">Streamline your social media presence</p>
          </div>
          
          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <Button 
                variant={showLogin ? "default" : "outline"}
                onClick={() => setShowLogin(true)}
                className="flex-1"
              >
                Login
              </Button>
              <Button 
                variant={!showLogin ? "default" : "outline"}
                onClick={() => setShowLogin(false)}
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
            {showLogin ? <LoginForm /> : <SignUpForm />}
          </Card>
        </div>
      </div>

      {/* Right side - 60% */}
      <div 
        className="w-[60%] p-8 flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div 
          key={currentFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-2xl text-center space-y-6 relative z-10"
        >
          <div className="text-6xl mb-4">{features[currentFeature].icon}</div>
          <h2 className="text-3xl font-bold text-primary">{features[currentFeature].title}</h2>
          <p className="text-xl text-muted-foreground">{features[currentFeature].description}</p>
        </motion.div>
      </div>
    </div>
  );
}