import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useRecurringPosts() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: { session } } = await supabase.auth.getSession();

  const createRecurringPost = async (postData: {
    content: string;
    platform: string;
    image_url?: string;
    scheduled_for: string;
    status: string;
    is_recurring: boolean;
    recurrence_pattern: string;
    recurrence_end_date: string;
  }) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          ...postData,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recurring post created successfully",
      });

      return data;
    } catch (error) {
      console.error("Error creating recurring post:", error);
      toast({
        title: "Error",
        description: "Failed to create recurring post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createRecurringPost,
  };
}