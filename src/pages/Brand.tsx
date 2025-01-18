import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";

export default function BrandPage() {
  return (
    <Layout>
      <div className="space-y-8">
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