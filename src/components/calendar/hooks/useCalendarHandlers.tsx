import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Post {
  content: string;
  platforms: string[];
  image: string;
  time: string;
  status: 'draft' | 'scheduled';
  date?: Date;
}

interface CalendarHandlersProps {
  setEditingPost: (post: any) => void;
  setNewPost: (post: any) => void;
  setIsDialogOpen: (open: boolean) => void;
  handleAddPost: (selectedDate: Date | undefined, post: Post) => Promise<any>;
  handleUpdatePost: (postId: string, selectedDate: Date | undefined, post: Post) => Promise<boolean>;
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please log in to schedule posts",
          variant: "destructive",
        });
        return;
      }

      for (const post of campaignPosts) {
        try {
          // Use the formatted date from the post if available, otherwise create it from time
          let scheduledDate: Date;
          if (post.date) {
            scheduledDate = post.date;
          } else {
            const [hours, minutes] = post.time.split(':').map(Number);
            scheduledDate = new Date(selectedDate!);
            scheduledDate.setHours(hours, minutes, 0, 0);
          }

          // Validate scheduled time
          if (scheduledDate < new Date()) {
            errors.push(`Cannot schedule post for ${post.platform} in the past`);
            continue;
          }

          const postData = {
            content: post.content,
            platform: post.platform.toLowerCase(),
            image_url: post.imageUrl || '',
            scheduled_for: scheduledDate.toISOString(),
            status: 'scheduled' as const,
            user_id: session.user.id
          };

          console.log('Scheduling post:', postData);

          const { data, error } = await supabase
            .from('posts')
            .insert(postData)
            .select()
            .single();

          if (error) {
            console.error('Error scheduling post:', error);
            errors.push(`Failed to schedule post for ${post.platform}: ${error.message}`);
          } else {
            successCount++;
            console.log('Successfully scheduled post:', data);
          }
        } catch (error: any) {
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

    } catch (error: any) {
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
      success = await handleUpdatePost(editingPost.id, selectedDate, editingPost);
    } else {
      success = await handleAddPost(selectedDate, editingPost);
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