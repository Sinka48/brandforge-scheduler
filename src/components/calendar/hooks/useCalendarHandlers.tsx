import { format } from "date-fns";

interface CalendarHandlersProps {
  setEditingPost: (post: any) => void;
  setNewPost: (post: any) => void;
  setIsDialogOpen: (open: boolean) => void;
  handleAddPost: (selectedDate: Date | undefined) => Promise<any>;
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
    const errors: string[] = [];
    
    try {
      for (const post of campaignPosts) {
        // Parse the time string to get hours and minutes
        const [hours, minutes] = post.time.split(':').map(Number);
        
        // Create a new date object for the scheduled time
        const scheduledDate = new Date(selectedDate!);
        scheduledDate.setHours(hours, minutes, 0, 0);

        const postData = {
          content: post.content,
          platforms: [post.platform],
          image: post.imageUrl || '',
          time: post.time,
          status: 'scheduled' as const,
          scheduled_for: scheduledDate.toISOString(),
        };

        console.log('Scheduling post:', postData);

        try {
          const result = await handleAddPost(scheduledDate);
          if (result) {
            successCount++;
            console.log('Successfully scheduled post:', result);
          } else {
            errors.push(`Failed to schedule post for ${post.platform}`);
          }
        } catch (error) {
          console.error('Error scheduling post:', error);
          errors.push(`Error scheduling post for ${post.platform}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Campaign Scheduled",
          description: `Successfully scheduled ${successCount} out of ${campaignPosts.length} posts`,
        });
      } else {
        toast({
          title: "Scheduling Failed",
          description: "Failed to schedule any posts. Please try again.",
          variant: "destructive",
        });
      }

      if (errors.length > 0) {
        console.error('Scheduling errors:', errors);
      }

    } catch (error) {
      console.error('Error scheduling campaign:', error);
      toast({
        title: "Error",
        description: "There was an error scheduling the campaign. Please try again.",
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