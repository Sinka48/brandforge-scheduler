import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";

export default function BrandPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Generator</h1>
          <p className="text-muted-foreground">
            Create a unique brand identity powered by AI.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Brand Questionnaire</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the details below to help us understand your brand better.
            </p>
            <BrandQuestionnaireForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}