import { Layout } from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";
import { BrandIdentityHeader } from "@/components/brand/identity/BrandIdentityHeader";
import { useBrandIdentity } from "@/hooks/useBrandIdentity";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function BrandIdentityPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleSave = async () => {
    await saveBrandAssets();
    toast({
      title: "Success",
      description: "Brand saved successfully",
    });
    navigate("/brands");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const handleDownload = async () => {
    if (!brandIdentity?.logoUrl) return;

    try {
      const response = await fetch(brandIdentity.logoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "logo.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading logo:", error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <BrandIdentityHeader
          brandExists={!!brandIdentity}
          isGenerating={generating}
          isSaving={saving}
          isDeleting={deleting}
          onGenerate={generateBrandIdentity}
          onSave={handleSave}
          onDelete={deleteBrandIdentity}
        />

        {brandIdentity && (
          <BrandReviewSection
            colors={brandIdentity.colors}
            typography={brandIdentity.typography}
            logoUrl={brandIdentity.logoUrl}
            onColorUpdate={(colors) => {
              if (brandIdentity) {
                brandIdentity.colors = colors;
              }
            }}
            onLogoCustomize={() => console.log("Customize logo")}
            onDownload={handleDownload}
          />
        )}
      </div>
    </Layout>
  );
}