import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function usePostDeletion() {
  const { toast } = useToast();

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post Deleted",
        description: "The post has been removed from your calendar.",
      });
      
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