import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BrandIdentityHeader } from "@/components/brand/identity/BrandIdentityHeader";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";

interface BrandIdentityPageProps {
  session: Session;
}

export default function BrandIdentityPage({ session }: BrandIdentityPageProps) {
  const {
    loading,
    saving,
    generating,
    brandIdentity,
    generateBrandIdentity,
    saveBrandAssets,
  } = useBrandIdentity();
  const navigate = useNavigate();

  const handleSave = async () => {
    await saveBrandAssets();
    // Redirect to brands page with success indicator
    navigate("/brand?tab=library&brandCreated=true");
  };

  if (loading) {
    return (
      <Layout session={session}>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout session={session}>
      <div className="container mx-auto max-w-5xl space-y-8 p-8">
        <BrandIdentityHeader
          brandName={brandIdentity?.metadata?.name}
          onSave={handleSave}
          onRegenerate={generateBrandIdentity}
          saving={saving}
          generating={generating}
        />

        {brandIdentity && (
          <BrandReviewSection
            brandName={brandIdentity.metadata?.name}
            logoUrl={brandIdentity.logoUrl}
            brand={{
              id: "",
              url: brandIdentity.logoUrl,
              metadata: brandIdentity.metadata,
              version: 1,
              created_at: new Date().toISOString(),
              asset_type: "brand_identity",
              questionnaire_id: "",
              user_id: session.user.id,
              asset_category: "brand"
            }}
          />
        )}
      </div>
    </Layout>
  );
}
