import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

export default function IndexPage() {
  const [session, setSession] = useState(null);
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
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your AI-Powered Brand Management Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and grow your brand with the power of AI. Generate brand identities,
            plan social media content, and analyze performance all in one place.
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
                    Sign up to start managing your brand with AI.
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

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Brand Generator</h3>
            <p className="text-sm text-muted-foreground">
              Create unique brand identities with AI assistance.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Content Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Plan and schedule your social media content.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track your brand's performance across platforms.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}