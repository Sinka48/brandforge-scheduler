import { useState } from "react";
import { usePostActions } from "./usePostActions";
import { useToast } from "./use-toast";

export function usePostCreation() {
  const [loading, setLoading] = useState(false);
  const { createPost, updatePost, deletePost } = usePostActions();
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
      const result = await createPost(postData);
      if (result) {
        toast({
          title: "Success",
          description: "Post created successfully",
        });
        return result;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreatePost,
  };
}