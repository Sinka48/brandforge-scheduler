import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types/brand";

export function useBrandFetching() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      console.log("Fetching brands...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your brands.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("brand_assets")
        .select("*")
        .eq('asset_category', 'brand')
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched brands data:", data);

      const transformedBrands: Brand[] = (data || []).map((item: any) => ({
        id: item.id,
        url: item.url,
        metadata: item.metadata as Brand['metadata'],
        version: item.version || 1,
        created_at: item.created_at,
        asset_type: item.asset_type,
        questionnaire_id: item.questionnaire_id,
        user_id: item.user_id,
        asset_category: item.asset_category,
        social_asset_type: item.social_asset_type,
        social_name: item.social_name,
        social_bio: item.social_bio
      }));

      console.log("Transformed brands:", transformedBrands);
      setBrands(transformedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { brands, loading, fetchBrands };
}