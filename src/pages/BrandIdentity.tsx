import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { BrandIdentityHeader } from "@/components/brand/identity/BrandIdentityHeader";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    generationProgress,
    generateBrandIdentity,
    saveBrandAssets,
    deleteBrandIdentity,
    regenerateAsset,
  } = useBrandIdentity();

  const navigate = useNavigate();

  const handleSave = async () => {
    await saveBrandAssets();
    navigate("/brand?tab=library&brandCreated=true");
  };

  const handleRegenerateAsset = async (assetType: string) => {
    await regenerateAsset(assetType);
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
            <CardContent className="flex flex-col items-center justify-center p-12 space-y-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="space-y-4 w-full max-w-md">
                <Progress value={generationProgress.percentage} className="w-full" />
                <p className="text-lg text-center text-muted-foreground">
                  {generationProgress.message}
                </p>
                <div className="space-y-2">
                  {generationProgress.completedSteps.map((step, index) => (
                    <div key={index} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2">✓</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
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
            onRegenerateAsset={handleRegenerateAsset}
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