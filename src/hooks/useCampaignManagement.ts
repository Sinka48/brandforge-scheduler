import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useCampaignManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCampaign = async (campaignData: any) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create campaigns",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaignData,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createCampaign,
  };
}
