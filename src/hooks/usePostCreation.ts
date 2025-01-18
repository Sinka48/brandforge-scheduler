import { useState } from "react";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePostCreation() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreatePost = async (postData: {
    content: string;
    platform: string;
    image_url?: string;
    scheduled_for: string;
    status?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    recurrence_end_date?: string;
  }) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("posts")
        .insert({
          ...postData,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreatePost,
  };
}