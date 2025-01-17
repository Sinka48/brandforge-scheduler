import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Session } from "@supabase/supabase-js";
import { Calendar, MessageSquare, Sparkles, Clock } from "lucide-react";

export default function IndexPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/calendar');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/calendar');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Smart Scheduling",
      description: "Schedule posts across multiple platforms with our intuitive calendar interface."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Content Management",
      description: "Create and manage your social media content from a single dashboard."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions to optimize your social media strategy."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Time-Saving Automation",
      description: "Automate your posting schedule and focus on creating great content."
    }
  ];

  return (
    <Layout>
      <div className="space-y-12 max-w-5xl mx-auto">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-center space-y-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Your AI-Powered Social Media Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule and manage your social media content across multiple platforms with ease.
            Let AI help you create engaging content and optimize your social media strategy.
          </p>
          <div className="flex gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8">
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create an account</DialogTitle>
                  <DialogDescription>
                    Sign up to start managing your social media content.
                  </DialogDescription>
                </DialogHeader>
                <SignUpForm />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Welcome back</DialogTitle>
                  <DialogDescription>
                    Sign in to your account to continue.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-4 rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your social media presence?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators and businesses who trust our platform.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create an account</DialogTitle>
                <DialogDescription>
                  Sign up to start your free trial.
                </DialogDescription>
              </DialogHeader>
              <SignUpForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}