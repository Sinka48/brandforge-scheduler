import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BrandIdentityHeader } from "@/components/brand/identity/BrandIdentityHeader";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";
import { Card, CardContent } from "@/components/ui/card";

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
    generateBrandIdentity,
    saveBrandAssets,
    deleteBrandIdentity,
  } = useBrandIdentity();
  const navigate = useNavigate();

  const handleSave = async () => {
    await saveBrandAssets();
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
          brandExists={!!brandIdentity}
          onSave={handleSave}
          onGenerate={generateBrandIdentity}
          onDelete={deleteBrandIdentity}
          isSaving={saving}
          isGenerating={generating}
          isDeleting={deleting}
        />

        {generating ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-lg text-center text-muted-foreground">
                Generating your brand identity...
                <br />
                This may take a few moments
              </p>
            </CardContent>
          </Card>
        ) : brandIdentity ? (
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
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              Click "Generate Brand Identity" to get started
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}