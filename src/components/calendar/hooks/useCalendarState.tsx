import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePostState } from "@/hooks/usePostState";
import { usePostManagement } from "@/hooks/usePostManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Not authenticated');
        }

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', session.user.id)
          .order('scheduled_for', { ascending: true });

        if (error) {
          console.error('Error fetching posts:', error);
          throw error;
        }

        if (!data) {
          console.log('No posts found');
          return [];
        }

        console.log('Fetched posts:', data);

        const formattedPosts = data.map(post => ({
          id: post.id,
          content: post.content,
          date: new Date(post.scheduled_for),
          platforms: [post.platform],
          image: post.image_url,
          status: post.status as 'draft' | 'scheduled',
          time: format(new Date(post.scheduled_for), 'HH:mm'),
        }));

        console.log('Formatted posts:', formattedPosts);
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
    refetchOnWindowFocus: false,
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