import { Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { Layout } from "@/components/layout/Layout";

interface SettingsPageProps {
  session: Session;
}

export default function SettingsPage({ session }: SettingsPageProps) {
  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="grid gap-6">
          <ProfileSettings session={session} />
          <NotificationSettings />
          <AppearanceSettings />
        </div>
      </div>
    </Layout>
  );
}