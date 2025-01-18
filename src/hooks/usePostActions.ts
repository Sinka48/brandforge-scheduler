import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function usePostActions(userId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPost = async (postData: {
    content: string;
    platform: string;
    image_url?: string;
    scheduled_for: string;
    status?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    recurrence_end_date?: string;
  }) => {
    const { error } = await supabase.from('posts').insert({
      ...postData,
      user_id: userId,
      status: postData.status || 'draft'
    });

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Success",
      description: "Post created successfully",
    });
  };

  const updatePost = async (postId: string, postData: {
    content?: string;
    platform?: string;
    image_url?: string;
    scheduled_for?: string;
    status?: string;
    is_recurring?: boolean;
    recurrence_pattern?: string;
    recurrence_end_date?: string;
  }) => {
    const { error } = await supabase.from('posts').update({
      ...postData,
      user_id: userId,
    }).eq('id', postId);

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Success",
      description: "Post updated successfully",
    });
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', userId);

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ['posts'] });
    toast({
      title: "Success",
      description: "Post deleted successfully",
    });
  };

  return {
    createPost,
    updatePost,
    deletePost,
  };
}
