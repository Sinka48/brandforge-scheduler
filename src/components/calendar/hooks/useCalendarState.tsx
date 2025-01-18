import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePostState } from "@/hooks/usePostState";
import { usePostManagement } from "@/hooks/usePostManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCalendarState() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const {
    posts,
    setPosts,
    isLoading: isManagementLoading,
    handleAddPost,
    handleDeletePost,
    handleUpdatePost,
  } = usePostManagement();

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
    isQueryLoading,
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handleDeletePost,
    handlePlatformToggle,
    handleUpdatePost,
  };
}