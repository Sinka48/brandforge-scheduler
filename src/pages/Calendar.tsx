import { Layout } from "@/components/layout/Layout";

export default function CalendarPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            Plan and schedule your social media content.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Calendar View</h2>
            <p className="text-sm text-muted-foreground">
              Your upcoming content schedule.
            </p>
            {/* Calendar component will be added here later */}
          </div>
        </div>
      </div>
    </Layout>
  );
}