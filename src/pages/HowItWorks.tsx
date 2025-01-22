import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Calendar, Wand2, BarChart3 } from "lucide-react";

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
            Learn how to leverage our AI-powered platform for effective social media management
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Schedule Posts</h3>
                  <p className="text-muted-foreground">
                    Create and schedule posts across multiple social media platforms from a single dashboard.
                    Set up recurring posts and manage your content calendar efficiently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Media Management</h3>
                  <p className="text-muted-foreground">
                    Upload and manage your media assets. Preview how your posts will look on different platforms
                    before publishing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">AI Campaign Generation</h3>
                  <p className="text-muted-foreground">
                    Generate entire social media campaigns with our AI. Simply provide your topic and preferences,
                    and let our AI create a series of coordinated posts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Smart Content Creation</h3>
                  <p className="text-muted-foreground">
                    Use AI to generate engaging post content optimized for each platform. Our AI helps maintain
                    your brand voice while maximizing engagement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Performance Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor your social media performance with detailed analytics. Track engagement rates,
                    audience growth, and content performance across platforms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">AI-Powered Insights</h3>
                  <p className="text-muted-foreground">
                    Get AI-driven recommendations for the best posting times, content types, and hashtags
                    based on your audience engagement patterns.
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