import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { Session } from "@supabase/supabase-js";

interface BrandPageProps {
  session: Session;
}

export default function BrandPage({ session }: BrandPageProps) {
  return (
    <Layout session={session}>
      <div className="space-y-8 p-4 md:p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Generator</h1>
          <p className="text-muted-foreground">
            Create and manage your brand identity
          </p>
        </div>

        <div className="space-y-6">
          <BrandQuestionnaireForm />
        </div>
      </div>
    </Layout>
  );
}