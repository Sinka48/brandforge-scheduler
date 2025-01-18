import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { VersionHistory } from "@/components/brand/identity/VersionHistory";
import { BrandReviewSection } from "@/components/brand/identity/BrandReviewSection";

interface BrandIdentity {
  colors: string[];
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  logoUrl: string;
}

interface Version {
  id: string;
  version: number;
  createdAt: string;
}

interface BrandAssetMetadata {
  colors: string[];
  typography: {
    headingFont: string;
    bodyFont: string;
  };
}

function isBrandAssetMetadata(value: unknown): value is BrandAssetMetadata {
  if (!value || typeof value !== 'object') return false;
  const metadata = value as Partial<BrandAssetMetadata>;
  return (
    Array.isArray(metadata.colors) &&
    typeof metadata.typography === 'object' &&
    typeof metadata.typography?.headingFont === 'string' &&
    typeof metadata.typography?.bodyFont === 'string'
  );
}

export default function BrandIdentityPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchBrandIdentity();
    fetchVersions();
  }, []);

  const fetchBrandIdentity = async () => {
    try {
      const { data: assets, error } = await supabase
        .from("brand_assets")
        .select("*")
        .eq("version", currentVersion)
        .maybeSingle();

      if (error) throw error;

      if (assets) {
        const metadata = assets.metadata;
        if (isBrandAssetMetadata(metadata)) {
          setBrandIdentity({
            colors: metadata.colors,
            typography: metadata.typography,
            logoUrl: assets.url || "",
          });
        } else {
          setBrandIdentity({
            colors: [],
            typography: {
              headingFont: "",
              bodyFont: "",
            },
            logoUrl: assets.url || "",
          });
          console.warn("Invalid metadata format:", metadata);
        }
      } else {
        setBrandIdentity(null);
      }
    } catch (error) {
      console.error("Error fetching brand identity:", error);
      toast({
        title: "Error",
        description: "Failed to load brand identity data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from("brand_assets")
        .select("id, version, created_at")
        .order("version", { ascending: false });

      if (error) throw error;

      setVersions(
        data.map((v) => ({
          id: v.id,
          version: v.version,
          createdAt: v.created_at,
        }))
      );
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const generateBrandIdentity = async () => {
    setGenerating(true);
    try {
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (questionnaireError) throw questionnaireError;

      if (!questionnaire) {
        toast({
          title: "Error",
          description: "Please complete the brand questionnaire first",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { 
            questionnaire,
            version: currentVersion + 1 
          },
        }
      );

      if (error) throw error;

      setBrandIdentity(data);
      setCurrentVersion((prev) => prev + 1);
      await fetchVersions();

      toast({
        title: "Success",
        description: "Brand identity generated successfully!",
      });
    } catch (error) {
      console.error("Error generating brand identity:", error);
      toast({
        title: "Error",
        description: "Failed to generate brand identity",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRestore = async (version: number) => {
    setCurrentVersion(version);
    await fetchBrandIdentity();
    toast({
      title: "Success",
      description: `Restored to version ${version}`,
    });
  };

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
      toast({
        title: "Error",
        description: "Failed to download logo",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!brandIdentity) return;

    setDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from("brand_assets")
        .delete()
        .eq("version", currentVersion);

      if (deleteError) throw deleteError;

      setBrandIdentity(null);
      setVersions([]);
      toast({
        title: "Success",
        description: "Brand identity deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting brand identity:", error);
      toast({
        title: "Error",
        description: "Failed to delete brand identity",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleColorUpdate = async (newColors: string[]) => {
    if (!brandIdentity) return;
    
    try {
      const { error } = await supabase
        .from("brand_assets")
        .update({
          metadata: {
            ...brandIdentity,
            colors: newColors,
          },
        })
        .eq("version", currentVersion);

      if (error) throw error;

      setBrandIdentity({
        ...brandIdentity,
        colors: newColors,
      });

      toast({
        title: "Success",
        description: "Color palette updated successfully",
      });
    } catch (error) {
      console.error("Error updating colors:", error);
      toast({
        title: "Error",
        description: "Failed to update color palette",
        variant: "destructive",
      });
    }
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Identity</h1>
            <p className="text-muted-foreground">
              Review and customize your brand identity
            </p>
          </div>
          <div className="flex gap-2">
            {brandIdentity && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Brand
              </Button>
            )}
            <Button onClick={generateBrandIdentity} disabled={generating}>
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {brandIdentity ? "Regenerate" : "Generate"} Brand Identity
            </Button>
          </div>
        </div>

        {brandIdentity && (
          <BrandReviewSection
            colors={brandIdentity.colors}
            typography={brandIdentity.typography}
            logoUrl={brandIdentity.logoUrl}
            onColorUpdate={handleColorUpdate}
            onLogoCustomize={() => console.log("Customize logo")}
            onDownload={handleDownload}
          />
        )}

        <Card className="p-6">
          <VersionHistory
            versions={versions}
            currentVersion={currentVersion}
            onRestore={handleRestore}
          />
        </Card>
      </div>
    </Layout>
  );
}
