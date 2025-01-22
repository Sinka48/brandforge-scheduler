import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePostState } from "@/hooks/usePostState";
import { usePostManagement } from "@/hooks/usePostManagement";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCalendarState() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const {
    posts,
    setPosts,
    isLoading: isManagementLoading,
    handleAddPost,
    handleDeletePost: baseHandleDeletePost,
    handleUpdatePost,
  } = usePostManagement();

  const handleDeletePost = async (postId: string) => {
    try {
      console.log('Attempting to delete post:', postId);
      
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }

      // Invalidate and refetch posts query
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Update local state
      setPosts(posts.filter(post => post.id !== postId));

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error in handleDeletePost:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status: 'scheduled',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: "Success",
        description: "Post scheduled for publishing",
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAsDraft = async () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return false;
    }

    const success = await handleAddPost(selectedDate, { ...newPost, status: 'draft' });
    if (success) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'draft',
        date: new Date()
      });
      setIsDialogOpen(false);
    }
    return success;
  };

  const { isLoading: isQueryLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setPosts([]); // Clear posts if not authenticated
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            campaigns (
              name,
              description
            )
          `)
          .eq('user_id', session.user.id)
          .order('scheduled_for', { ascending: true });

        if (error) {
          console.error('Error fetching posts:', error);
          toast({
            title: "Error",
            description: "Failed to fetch posts. Please try again.",
            variant: "destructive",
          });
          return [];
        }

        if (!data) {
          console.log('No posts found');
          return [];
        }

        const formattedPosts = data.map(post => ({
          id: post.id,
          content: post.content,
          date: new Date(post.scheduled_for),
          platforms: [post.platform],
          image: post.image_url,
          status: post.status as 'draft' | 'scheduled',
          time: format(new Date(post.scheduled_for), 'HH:mm'),
          campaign: post.campaigns ? {
            id: post.campaign_id,
            name: post.campaigns.name,
            description: post.campaigns.description
          } : undefined
        }));

        setPosts(formattedPosts);
        return formattedPosts;
      } catch (error) {
        console.error('Error in queryFn:', error);
        toast({
          title: "Error",
          description: "Failed to fetch posts. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return {
    selectedDate,
    setSelectedDate,
    isDialogOpen,
    setIsDialogOpen,
    isCampaignDialogOpen,
    setIsCampaignDialogOpen,
    editingPost,
    setEditingPost,
    toast,
    posts,
    isManagementLoading,
    isQueryLoading: false,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
    handleUpdatePost,
    handlePublishPost,
  };
}