
import { useState } from "react";
import { format, set } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { usePostCreate } from "./post/usePostCreate";
import { usePostUpdate } from "./post/usePostUpdate";
import { usePostDelete } from "./post/usePostDelete";
import { useToast } from "./use-toast";

export function usePostManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { handleAddPost: createPost } = usePostCreate();
  const { handleUpdatePost: updatePost } = usePostUpdate();
  const { handleDeletePost: deletePost } = usePostDelete();

  const handleAddPost = async (selectedDate: Date | undefined, newPost: any) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create posts",
          variant: "destructive",
        });
        return false;
      }

      if (!selectedDate) {
        toast({
          title: "Error",
          description: "Please select a date for the post",
          variant: "destructive",
        });
        return false;
      }

      const [hours, minutes] = newPost.time.split(':').map(Number);
      const scheduledDate = set(selectedDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0
      });

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: scheduledDate.toISOString(),
          status: newPost.status,
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setPosts([...posts, {
          id: data.id,
          content: data.content,
          date: new Date(data.scheduled_for),
          platforms: [data.platform],
          image: data.image_url,
          status: data.status,
          time: format(new Date(data.scheduled_for), 'HH:mm'),
        }]);
      }
      return !!data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (postId: string, selectedDate: Date | undefined, newPost: any) => {
    setIsLoading(true);
    try {
      const success = await updatePost(postId, selectedDate, newPost);
      if (success) {
        const { data, error } = await supabase
          .from('posts')
          .select()
          .eq('id', postId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setPosts(posts.map(post => 
            post.id === postId ? {
              ...post,
              content: data.content,
              date: new Date(data.scheduled_for),
              platforms: [data.platform],
              image: data.image_url,
              status: data.status,
              time: format(new Date(data.scheduled_for), 'HH:mm'),
            } : post
          ));
        }
      }
      return success;
    } catch (error: any) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsLoading(true);
    try {
      const success = await deletePost(postId);
      if (success) {
        setPosts(posts.filter(post => post.id !== postId));
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post: any) => {
    return {
      ...post,
      platforms: Array.isArray(post.platforms) ? post.platforms : [post.platform],
      time: format(new Date(post.date), 'HH:mm'),
    };
  };

  return {
    posts,
    setPosts,
    isLoading,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleEditPost,
  };
}
