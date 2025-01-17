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

export default function IndexPage() {
  const [session, setSession] = useState(null);
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

  return (
    <Layout>
      <div className="space-y-12">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your AI-Powered Social Media Manager
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule and manage your social media content across multiple platforms with ease.
            Create, plan, and analyze your social media presence all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">Get Started</Button>
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
                <Button variant="outline" size="lg">
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

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Multi-Platform Support</h3>
            <p className="text-sm text-muted-foreground">
              Schedule posts for Instagram, Twitter, Facebook, and LinkedIn.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Smart Scheduling</h3>
            <p className="text-sm text-muted-foreground">
              Plan your content calendar with our intuitive scheduling interface.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Analytics & Insights</h3>
            <p className="text-sm text-muted-foreground">
              Track performance and engagement across all your social platforms.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}