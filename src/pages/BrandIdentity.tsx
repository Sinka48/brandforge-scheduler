import { Layout } from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";
import { BrandIdentityHeader } from "@/components/brand/identity/BrandIdentityHeader";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { Brand } from "@/types/brand";

interface BrandIdentityPageProps {
  session: Session;
}

export default function BrandIdentityPage({ session }: BrandIdentityPageProps) {
  const {
    loading,
    saving,
    generating,
    deleting,
    brandIdentity,
    fetchBrandIdentity,
    generateBrandIdentity,
    saveBrandAssets,
    deleteBrandIdentity,
  } = useBrandIdentity();

  useEffect(() => {
    fetchBrandIdentity();
  }, []);

  if (loading) {
    return (
      <Layout session={session}>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Convert BrandIdentity to Brand type for the BrandReviewSection
  const brandData: Brand | undefined = brandIdentity ? {
    id: "",
    asset_type: "logo",
    created_at: new Date().toISOString(),
    metadata: brandIdentity.metadata,
    questionnaire_id: "",
    url: brandIdentity.logoUrl,
    user_id: "",
    version: 1,
  } : undefined;

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Identity</h1>
          <p className="text-muted-foreground">
            Review and customize your brand identity
          </p>
        </div>

        <BrandIdentityHeader
          brandExists={!!brandIdentity}
          isGenerating={generating}
          isSaving={saving}
          isDeleting={deleting}
          onGenerate={generateBrandIdentity}
          onSave={saveBrandAssets}
          onDelete={deleteBrandIdentity}
        />

        {brandIdentity && (
          <BrandReviewSection
            brandName={brandIdentity.metadata?.name}
            logoUrl={brandIdentity.logoUrl}
            brand={brandData}
          />
        )}
      </div>
    </Layout>
  );
}