import { Layout } from "@/components/layout/Layout";

export default function IndexPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Brand AI. Your AI-powered brand management platform.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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