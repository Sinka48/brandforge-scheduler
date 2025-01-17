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
import { Calendar, MessageSquare, Sparkles, ArrowRight, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

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
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Smart Content Creation",
      description: "Create engaging posts with AI assistance for multiple platforms",
      benefits: ["AI-powered content suggestions", "Platform-specific optimization", "Consistent brand voice"]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Intelligent Scheduling",
      description: "Schedule posts at optimal times across different platforms",
      benefits: ["Best time recommendations", "Cross-platform coordination", "Automated posting"]
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Brand Management",
      description: "Maintain consistent brand messaging across all channels",
      benefits: ["Brand voice templates", "Style guide integration", "Visual consistency"]
    }
  ];

  return (
    <Layout>
      <div className="space-y-12 max-w-5xl mx-auto px-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-center space-y-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Your Social Media, Simplified
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, schedule, and manage your social media content with AI-powered assistance
          </p>

          <div className="grid gap-8 md:grid-cols-3 mt-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-left">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-3 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create your account</DialogTitle>
                  <DialogDescription>
                    Sign up to start managing your social media content.
                  </DialogDescription>
                </DialogHeader>
                <SignUpForm />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Welcome back</DialogTitle>
                  <DialogDescription>
                    Sign in to continue managing your content.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
}