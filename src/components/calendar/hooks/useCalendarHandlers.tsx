import { format } from "date-fns";

interface CalendarHandlersProps {
  setEditingPost: (post: any) => void;
  setNewPost: (post: any) => void;
  setIsDialogOpen: (open: boolean) => void;
  handleAddPost: (selectedDate: Date | undefined) => Promise<boolean>;
  handleUpdatePost: (postId: string, selectedDate: Date | undefined) => Promise<boolean>;
  toast: any;
  selectedDate: Date | undefined;
}

export function useCalendarHandlers({
  setEditingPost,
  setNewPost,
  setIsDialogOpen,
  handleAddPost,
  handleUpdatePost,
  toast,
  selectedDate,
}: CalendarHandlersProps) {
  const handleGenerateCampaign = async (campaignPosts: any[]) => {
    let successCount = 0;
    
    try {
      for (const post of campaignPosts) {
        setNewPost({
          content: post.content,
          platforms: [post.platform],
          image: '',
          time: post.time,
          status: 'scheduled',
        });
        
        const success = await handleAddPost(selectedDate);
        if (success) {
          successCount++;
        }
      }

      toast({
        title: "Campaign Scheduled",
        description: `Successfully scheduled ${successCount} out of ${campaignPosts.length} posts`,
      });
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast({
        title: "Error",
        description: "There was an error scheduling some posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setNewPost({
      content: post.content,
      platforms: post.platforms,
      image: post.image || '',
      time: post.time,
      status: post.status,
    });
    setIsDialogOpen(true);
  };

  const onAddPost = async (editingPost: any, selectedDate: Date | undefined) => {
    let success;
    if (editingPost) {
      success = await handleUpdatePost(editingPost.id, selectedDate);
    } else {
      success = await handleAddPost(selectedDate);
    }
    if (success) {
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  };

  const onSaveAsDraft = async (handleSaveAsDraft: (selectedDate: Date | undefined) => Promise<boolean>) => {
    const success = await handleSaveAsDraft(selectedDate);
    if (success) {
      setIsDialogOpen(false);
      setEditingPost(null);
    }
  };

  const onDialogClose = (open: boolean, setNewPost: (post: any) => void) => {
    if (!open) {
      setEditingPost(null);
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
      });
    }
    setIsDialogOpen(open);
  };

  return {
    handleGenerateCampaign,
    handleEditPost,
    onAddPost,
    onSaveAsDraft,
    onDialogClose,
  };
}