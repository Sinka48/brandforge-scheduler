import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Brand } from "@/types/brand";

interface BrandIdentity {
  metadata: {
    name?: string;
    socialBio?: string;
    socialAssets?: {
      profileImage?: string;
      coverImage?: string;
    };
    colors?: string[];
  };
  logoUrl: string;
}

interface GenerationProgress {
  percentage: number;
  message: string;
  completedSteps: string[];
}

export function useBrandIdentity() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [brandIdentity, setBrandIdentity] = useState<BrandIdentity | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    percentage: 0,
    message: "Initializing brand generation...",
    completedSteps: [],
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateProgress = (progress: Partial<GenerationProgress>) => {
    setGenerationProgress(prev => ({
      ...prev,
      ...progress,
    }));
  };

  const generateBrandIdentity = async () => {
    setGenerating(true);
    try {
      updateProgress({
        percentage: 10,
        message: "Fetching questionnaire data...",
        completedSteps: ["Initialized generation process"],
      });

      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (questionnaireError) throw questionnaireError;

      if (!questionnaire) {
        toast({
          title: "Error",
          description: "Please complete the brand questionnaire first",
          variant: "destructive",
        });
        navigate("/brand");
        return;
      }

      updateProgress({
        percentage: 30,
        message: "Generating brand identity...",
        completedSteps: [
          "Initialized generation process",
          "Retrieved questionnaire data",
        ],
      });

      const { data, error } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { questionnaire },
        }
      );

      if (error) throw error;

      updateProgress({
        percentage: 90,
        message: "Finalizing brand assets...",
        completedSteps: [
          "Initialized generation process",
          "Retrieved questionnaire data",
          "Generated brand identity",
          "Created visual assets",
        ],
      });

      setBrandIdentity(data);

      updateProgress({
        percentage: 100,
        message: "Brand identity generated successfully!",
        completedSteps: [
          "Initialized generation process",
          "Retrieved questionnaire data",
          "Generated brand identity",
          "Created visual assets",
          "Completed generation",
        ],
      });

      toast({
        title: "Success",
        description: "Brand identity generated successfully!",
      });
    } catch (error) {
      console.error("Error generating brand identity:", error);
      toast({
        title: "Error",
        description: "Failed to generate brand identity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const regenerateAsset = async (assetType: string) => {
    try {
      const { data: questionnaire } = await supabase
        .from("brand_questionnaires")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!questionnaire) {
        toast({
          title: "Error",
          description: "No brand questionnaire found",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Regenerating",
        description: `Regenerating ${assetType}...`,
      });

      const { data, error } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { 
            questionnaire,
            regenerateOnly: assetType,
          },
        }
      );

      if (error) throw error;

      // Update only the regenerated asset in the brand identity
      setBrandIdentity(prev => {
        if (!prev) return data;
        
        const updated = { ...prev };
        switch (assetType) {
          case 'logo':
            updated.logoUrl = data.logoUrl;
            break;
          case 'colors':
            updated.metadata = {
              ...updated.metadata,
              colors: data.metadata.colors,
            };
            break;
          case 'typography':
            updated.metadata = {
              ...updated.metadata,
              typography: data.metadata.typography,
            };
            break;
          default:
            if (assetType.includes('social')) {
              updated.metadata = {
                ...updated.metadata,
                socialAssets: {
                  ...updated.metadata.socialAssets,
                  ...data.metadata.socialAssets,
                },
              };
            }
        }
        return updated;
      });

      toast({
        title: "Success",
        description: `Successfully regenerated ${assetType}`,
      });
    } catch (error) {
      console.error("Error regenerating asset:", error);
      toast({
        title: "Error",
        description: `Failed to regenerate ${assetType}`,
        variant: "destructive",
      });
    }
  };

  const fetchBrandIdentity = async () => {
    try {
      setLoading(true);
      console.log("Fetching brand identity...");
      
      const { data: assets, error } = await supabase
        .from("brand_assets")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (assets) {
        console.log("Found brand assets:", assets);
        const metadata = assets.metadata as Brand['metadata'];
        setBrandIdentity({
          metadata: {
            name: metadata.name,
            socialBio: metadata.socialBio,
            socialAssets: metadata.socialAssets
          },
          logoUrl: assets.url || "",
        });
      } else {
        console.log("No brand assets found");
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

  const saveBrandAssets = async () => {
    if (!brandIdentity) return;

    setSaving(true);
    try {
      console.log("Saving brand assets...");
      
      const { data: questionnaire } = await supabase
        .from("brand_questionnaires")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!questionnaire) {
        toast({
          title: "Error",
          description: "No brand questionnaire found",
          variant: "destructive",
        });
        return;
      }

      const { error: logoError } = await supabase
        .from("brand_assets")
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          questionnaire_id: questionnaire.id,
          asset_type: "logo",
          url: brandIdentity.logoUrl,
          metadata: {
            socialAssets: brandIdentity.metadata.socialAssets,
            socialBio: brandIdentity.metadata.socialBio,
            name: brandIdentity.metadata.name
          }
        });

      if (logoError) throw logoError;

      toast({
        title: "Success",
        description: "Brand assets saved successfully!",
      });

      navigate("/brand/management");
    } catch (error) {
      console.error("Error saving brand assets:", error);
      toast({
        title: "Error",
        description: "Failed to save brand assets",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteBrandIdentity = async () => {
    if (!brandIdentity) return;

    setDeleting(true);
    try {
      console.log("Deleting brand identity...");
      
      const { error: deleteError } = await supabase
        .from("brand_assets")
        .delete()
        .order('created_at', { ascending: false })
        .limit(1);

      if (deleteError) throw deleteError;

      setBrandIdentity(null);
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

  return {
    loading,
    saving,
    generating,
    deleting,
    brandIdentity,
    generationProgress,
    fetchBrandIdentity,
    generateBrandIdentity,
    saveBrandAssets,
    deleteBrandIdentity,
    regenerateAsset,
  };
}
