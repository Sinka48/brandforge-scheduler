import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export function useBulkScheduling() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { data: { session } } = await supabase.auth.getSession();

  const createBulkPosts = async (posts: Array<{
    content: string;
    platform: string;
    image_url?: string;
    scheduled_for: string;
    status: string;
    batch_id?: string;
  }>) => {
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
      const batchId = crypto.randomUUID();
      const postsWithBatchId = posts.map(post => ({
        ...post,
        batch_id: batchId,
        user_id: session.user.id,
      }));

      const { data, error } = await supabase
        .from("posts")
        .insert(postsWithBatchId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Posts scheduled successfully",
      });

      return data;
    } catch (error) {
      console.error("Error creating bulk posts:", error);
      toast({
        title: "Error",
        description: "Failed to schedule posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createBulkPosts,
  };
}