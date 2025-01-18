import { supabase } from "@/integrations/supabase/client";
import type { ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

type ToastFunction = (props: ToastProps) => void;

export function usePostDeletion(toast: ToastFunction) {
  const handleDeletePost = async (postId: string, deleteAll: boolean = false) => {
    try {
      if (deleteAll) {
        // First get the post to check if it's part of a recurring series
        const { data: post } = await supabase
          .from('posts')
          .select('scheduled_for, parent_post_id')
          .eq('id', postId)
          .single();

        if (post) {
          const parentId = post.parent_post_id || postId;
          const { error } = await supabase
            .from('posts')
            .delete()
            .or(`id.eq.${parentId},parent_post_id.eq.${parentId}`)
            .gte('scheduled_for', post.scheduled_for);

          if (error) throw error;

          toast({
            title: "Series Deleted",
            description: "All future posts in this series have been removed.",
          });
        }
      } else {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        toast({
          title: "Post Deleted",
          description: "The post has been removed from your calendar.",
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleDeletePost,
  };
}
