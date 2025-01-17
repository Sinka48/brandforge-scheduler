import { Layout } from "@/components/layout/Layout";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Account Settings</h2>
              <p className="text-sm text-muted-foreground">
                Update your account information and preferences.
              </p>
              {/* Account settings form will be added here later */}
            </div>
          </div>
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Brand Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure your brand settings and defaults.
              </p>
              {/* Brand settings form will be added here later */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}