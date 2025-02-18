
import { useState, useEffect } from "react";
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

      console.log("Fetching user-generated brands...");
      const { data, error } = await supabase
        .from("brand_assets")
        .select("id, url, metadata, asset_type, questionnaire_id")
        .eq("user_id", session.user.id)
        .eq("asset_category", "brand")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching brands:", error);
        let errorMessage = "Failed to load brands. Please try again.";
        if (error.code === "57014") {
          errorMessage = "Request timed out. Please try again.";
        }
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Successfully fetched brands data:", data);

      const transformedBrands: Brand[] = (data || []).map((item: any) => ({
        id: item.id,
        url: item.url,
        metadata: item.metadata || {},
        version: 1,
        created_at: new Date().toISOString(),
        asset_type: item.asset_type,
        questionnaire_id: item.questionnaire_id,
        user_id: session.user.id,
        asset_category: "brand",
        social_asset_type: null,
        social_name: null,
        social_bio: null
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

  useEffect(() => {
    fetchBrands();
  }, []); // Run on mount

  return { brands, loading, fetchBrands };
}
