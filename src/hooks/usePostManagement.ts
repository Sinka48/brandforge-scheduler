import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { usePostCreation } from "./usePostCreation";
import { usePostDeletion } from "./usePostDeletion";

export function usePostManagement() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { newPost, setNewPost, handlePlatformToggle } = usePostCreation();

  const handleAddPost = async (selectedDate: Date | undefined) => {
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
          description: "You must be logged in to create posts.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
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
          status: newPost.status,
          user_id: session.user.id,
          is_recurring: newPost.isRecurring || false,
          recurrence_pattern: newPost.recurringPattern,
          recurrence_end_date: newPost.recurringEndDate?.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      setPosts([...posts, {
        id: data.id,
        content: data.content,
        date: new Date(data.scheduled_for),
        platforms: [data.platform],
        image: data.image_url,
        status: data.status,
        time: format(new Date(data.scheduled_for), 'HH:mm'),
      }]);

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });

      toast({
        title: "Success",
        description: "Your post has been created.",
      });

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save drafts.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
          status: 'draft',
          user_id: session.user.id
        })
        .select()
        .single();

      if (error) throw error;

      setPosts([...posts, {
        id: data.id,
        content: data.content,
        date: new Date(data.scheduled_for),
        platforms: [data.platform],
        image: data.image_url,
        status: 'draft',
        time: format(new Date(data.scheduled_for), 'HH:mm'),
      }]);

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'draft',
      });

      toast({
        title: "Success",
        description: "Your draft has been saved.",
      });

      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
      return false;
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

      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Success",
        description: "Post deleted successfully.",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePost = async (postId: string, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
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
          status: newPost.status,
        })
        .eq('id', postId)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? {
              id: data.id,
              content: data.content,
              date: new Date(data.scheduled_for),
              platforms: [data.platform],
              image: data.image_url,
              status: data.status,
              time: format(new Date(data.scheduled_for), 'HH:mm'),
            }
          : post
      ));

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });

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
    handleUpdatePost,
  };
}
