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
import { Calendar, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
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

  const mainJourney = {
    title: "Schedule & Manage Posts",
    description: "Create, schedule, and manage your social media content across multiple platforms",
    steps: [
      {
        title: "Create Content",
        description: "Write engaging posts with AI assistance",
        icon: <MessageSquare className="h-6 w-6" />,
      },
      {
        title: "Schedule Posts",
        description: "Set optimal posting times across platforms",
        icon: <Calendar className="h-6 w-6" />,
      },
      {
        title: "Brand Consistency",
        description: "Maintain your brand voice and style",
        icon: <Sparkles className="h-6 w-6" />,
      },
    ],
  };

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
            Streamline Your Social Media Management
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, schedule, and manage your social media content with AI-powered assistance
          </p>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">{mainJourney.title}</CardTitle>
              <CardDescription>{mainJourney.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {mainJourney.steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 space-y-2">
                    <div className="rounded-full bg-primary/10 p-3">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
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
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}