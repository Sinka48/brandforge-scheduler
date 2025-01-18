import { Button } from "@/components/ui/button";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">
              Manage Your Social Media Presence
            </h1>
            <p className="text-xl text-muted-foreground">
              Create, schedule, and analyze your social media content with our powerful platform.
            </p>
            <div className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Brand Identity Generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Content Calendar Management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Campaign Analytics
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-card p-8 rounded-lg border">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                    },
                  },
                },
              }}
              theme="default"
              providers={[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}