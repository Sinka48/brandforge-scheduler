import { Session } from "@supabase/supabase-js";
import { SocialConnections } from "@/components/settings/SocialConnections";

interface SettingsPageProps {
  session: Session;
}

export default function SettingsPage({ session }: SettingsPageProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <SocialConnections />
    </div>
  );
}