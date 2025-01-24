import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { Session } from "@supabase/supabase-js";

interface BrandGeneratorPageProps {
  session: Session;
}

export default function BrandGeneratorPage({ session }: BrandGeneratorPageProps) {
  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Generator</h1>
          <p className="text-muted-foreground">
            Create and manage your brand identity
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <BrandQuestionnaireForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}