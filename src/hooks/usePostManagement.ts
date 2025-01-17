import { useState } from "react";
import { usePostCreation } from "./usePostCreation";
import { usePostDeletion } from "./usePostDeletion";
import { supabase } from "@/lib/supabase";
import { useToast } from "./use-toast";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

export function usePostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { newPost, setNewPost, handleAddPost: createPost, handleSaveAsDraft: saveDraft, handlePlatformToggle } = usePostCreation();
  const { handleDeletePost: deletePost } = usePostDeletion();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for the post",
        variant: "destructive",
      });
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = newPost.time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes);

      // Create a post for each selected platform
      const results = await Promise.all(
        newPost.platforms.map(async (platform) => {
          const { data, error } = await supabase
            .from('posts')
            .insert({
              content: newPost.content,
              platform: platform,
              scheduled_for: scheduledDate.toISOString(),
              image_url: newPost.image,
              status: 'scheduled',
              user_id: user.id
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        })
      );

      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });

      return results[0];
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for the draft",
        variant: "destructive",
      });
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save drafts",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const scheduledDate = new Date(selectedDate);
      const [hours, minutes] = newPost.time.split(':').map(Number);
      scheduledDate.setHours(hours, minutes);

      // Create a draft for each selected platform
      const results = await Promise.all(
        newPost.platforms.map(async (platform) => {
          const { data, error } = await supabase
            .from('posts')
            .insert({
              content: newPost.content,
              platform: platform,
              scheduled_for: scheduledDate.toISOString(),
              image_url: newPost.image,
              status: 'draft',
              user_id: user.id
            })
            .select()
            .single();

          if (error) throw error;
          return data;
        })
      );

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });

      return results[0];
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
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
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      setPosts(posts.filter(post => post.id !== postId));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts,
    setPosts,
    isLoading,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
  };
}