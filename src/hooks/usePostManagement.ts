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
  const { newPost, setNewPost, handleAddPost: addPost, handleSaveAsDraft, handlePlatformToggle } = usePostCreation();
  const { handleDeletePost: deletePost } = usePostDeletion();

  const handleAddPost = async (selectedDate: Date | undefined) => {
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
          description: "You must be logged in to create posts.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0], // Assuming single platform for now
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: newPost.status,
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
          status: newPost.status
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

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

      return data;
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

  return {
    posts,
    setPosts,
    isLoading,
    newPost,
    setNewPost,
    handleAddPost,
    handleUpdatePost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
  };
}