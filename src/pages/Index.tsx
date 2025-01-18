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
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";

const features = [
  {
    title: "Social Media Calendar",
    description: "Plan and schedule your content across multiple platforms with our intuitive calendar interface.",
  },
  {
    title: "Brand Identity Management",
    description: "Create and maintain consistent brand guidelines, color schemes, and visual assets.",
  },
  {
    title: "Campaign Analytics",
    description: "Track performance metrics and engagement rates for all your social media campaigns.",
  },
  {
    title: "AI-Powered Content",
    description: "Generate engaging content ideas and captions with our AI assistant.",
  },
  {
    title: "Multi-Platform Support",
    description: "Manage content for all major social media platforms in one place.",
  }
];

interface IndexPageProps {
  session: Session | null;
}

export default function IndexPage({ session }: IndexPageProps) {
  const [showLogin, setShowLogin] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setDisplayText("");
      setIsTyping(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isTyping) return;

    const text = features[currentFeature].description;
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentFeature, isTyping]);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
    } catch (error) {
      console.error('Error signing in with Github:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-[40%] p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>
          
          <div className="space-y-4">
            {showLogin ? <LoginForm /> : <SignUpForm />}
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Button 
                variant="outline" 
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowLogin(!showLogin)}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                {showLogin ? "Create an account" : "Sign in with email"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[60%] p-8 flex flex-col items-start justify-start relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#ff99df',
            backgroundImage: `
              radial-gradient(circle at 52% 73%, hsla(310, 85%, 67%, 1) 0px, transparent 50%),
              radial-gradient(circle at 0% 30%, hsla(197, 90%, 76%, 1) 0px, transparent 50%),
              radial-gradient(circle at 41% 26%, hsla(234, 79%, 69%, 1) 0px, transparent 50%),
              radial-gradient(circle at 41% 51%, hsla(41, 70%, 63%, 1) 0px, transparent 50%),
              radial-gradient(circle at 41% 88%, hsla(36, 83%, 61%, 1) 0px, transparent 50%),
              radial-gradient(circle at 76% 73%, hsla(346, 69%, 70%, 1) 0px, transparent 50%),
              radial-gradient(circle at 29% 37%, hsla(272, 96%, 64%, 1) 0px, transparent 50%)
            `,
            backgroundSize: '150% 150%',
            filter: 'blur(80px)',
            animation: 'moveBackground 10s linear infinite',
          }}
        />
        <motion.div 
          key={currentFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-2xl text-left space-y-6 relative z-10 pt-8"
        >
          <h2 className="text-3xl font-bold text-white">{features[currentFeature].title}</h2>
          <p className="text-xl text-white/80">
            {displayText}
            <span className="ml-1 animate-[blink_1s_infinite]">|</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
