
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brand } from "@/types/brand";
import { useNavigate } from "react-router-dom";

export function useBrandFetching() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBrands = async () => {
    try {
      console.log("Checking authentication...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No active session found");
        toast({
          title: "Authentication required",
          description: "Please sign in to view your brands.",
          variant: "destructive",
        });
        navigate('/');
        setLoading(false);
        return;
      }

      console.log("Fetching brands for authenticated user...");
      const { data, error } = await supabase
        .from("brand_assets")
        .select("id, url, metadata, version, created_at, asset_type, questionnaire_id, user_id, asset_category, social_asset_type, social_name, social_bio")
        .eq('asset_category', 'brand')
        .eq('user_id', session.user.id)
        .order("created_at", { ascending: false })
        .limit(50); // Add limit to prevent timeouts

      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }

      console.log("Successfully fetched brands data:", data);

      const transformedBrands: Brand[] = (data || []).map((item: any) => ({
        id: item.id,
        url: item.url,
        metadata: item.metadata,
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
      console.error("Error in fetchBrands:", error);
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
