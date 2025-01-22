import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface HowItWorksPageProps {
  session: Session | null;
}

export default function HowItWorksPage({ session }: HowItWorksPageProps) {
  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">How It Works</h1>
          <p className="text-muted-foreground">
            Learn how to use our AI-powered social media management platform
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Create AI Campaigns</h3>
                  <p className="text-muted-foreground">
                    Use our AI to generate entire social media campaigns in seconds. Just provide your topic and preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Schedule Individual Posts</h3>
                  <p className="text-muted-foreground">
                    Create and schedule single posts across multiple platforms with our intuitive post editor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Track Performance</h3>
                  <p className="text-muted-foreground">
                    Monitor your social media performance with detailed analytics and engagement metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Content Generation</h3>
                  <p className="text-muted-foreground">
                    Our AI helps you create engaging content tailored to your brand voice and target audience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Smart Scheduling</h3>
                  <p className="text-muted-foreground">
                    AI-powered scheduling suggestions based on your audience's peak engagement times.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Campaign Optimization</h3>
                  <p className="text-muted-foreground">
                    Continuous learning from your campaign performance to improve future content recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}