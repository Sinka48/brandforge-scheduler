import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ColorPaletteCard } from "@/components/brand/identity/ColorPaletteCard";
import { TypographyCard } from "@/components/brand/identity/TypographyCard";
import { LogoCard } from "@/components/brand/identity/LogoCard";
import { VersionHistory } from "@/components/brand/identity/VersionHistory";

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

export default function BrandIdentityPage() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
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
        .single();

      if (error) throw error;

      if (assets) {
        setBrandIdentity({
          colors: assets.metadata.colors || [],
          typography: assets.metadata.typography || {
            headingFont: "",
            bodyFont: "",
          },
          logoUrl: assets.url || "",
        });
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
      const { data, error } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { version: currentVersion + 1 },
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
              Generate and manage your brand identity assets
            </p>
          </div>
          <Button onClick={generateBrandIdentity} disabled={generating}>
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {brandIdentity ? "Regenerate" : "Generate"} Brand Identity
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ColorPaletteCard
            colors={brandIdentity?.colors || []}
            onCustomize={(colors) => {
              // Implement color customization
              console.log("Customize colors:", colors);
            }}
          />
          <TypographyCard
            typography={
              brandIdentity?.typography || { headingFont: "", bodyFont: "" }
            }
            onCustomize={(typography) => {
              // Implement typography customization
              console.log("Customize typography:", typography);
            }}
          />
          <LogoCard
            logoUrl={brandIdentity?.logoUrl || ""}
            onDownload={handleDownload}
            onCustomize={() => {
              // Implement logo customization
              console.log("Customize logo");
            }}
          />
        </div>

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