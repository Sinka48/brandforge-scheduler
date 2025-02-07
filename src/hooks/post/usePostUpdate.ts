
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function usePostUpdate() {
  const { toast } = useToast();

  const handleUpdatePost = async (postId: string, newPost: any, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return false;
    }

    if (!newPost.platforms || newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to update posts.",
          variant: "destructive",
        });
        return false;
      }

      // First verify the post exists and belongs to the user
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', postId)
        .eq('user_id', session.user.id)
        .single();

      if (fetchError || !existingPost) {
        console.error('Error fetching post:', fetchError);
        toast({
          title: "Error",
          description: "Post not found or you don't have permission to update it.",
          variant: "destructive",
        });
        return false;
      }

      // Then perform the update
      const { data, error } = await supabase
        .from('posts')
        .update({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: newPost.status
        })
        .eq('id', postId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Your post has been updated.",
      });

      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleUpdatePost };
}
