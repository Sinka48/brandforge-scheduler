import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { BrandManager } from "@/components/brand/BrandManager";
import { Wand2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Generated Brands</h2>
          <BrandManager />
        </div>
      </div>
    </Layout>
  );
}