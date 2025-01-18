import { useToast } from "./use-toast";
import { createBulkPosts } from "./useBulkScheduling";
import { createRecurringPosts } from "./useRecurringPosts";
import { supabase } from "@/integrations/supabase/client";

export function usePostActions() {
  const { toast } = useToast();

  const createPost = async (newPost: any, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const scheduledTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(newPost.time.split(':')[0]),
        parseInt(newPost.time.split(':')[1])
      );

      const { data: parentPost, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: scheduledTime.toISOString(),
          status: 'scheduled',
          is_recurring: newPost.isRecurring || false,
          recurrence_pattern: newPost.recurringPattern,
          recurrence_end_date: newPost.recurringEndDate?.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Create additional platform posts
      for (let i = 1; i < newPost.platforms.length; i++) {
        await supabase
          .from('posts')
          .insert({
            content: newPost.content,
            platform: newPost.platforms[i],
            image_url: newPost.image || null,
            scheduled_for: scheduledTime.toISOString(),
            status: 'scheduled',
            batch_id: parentPost.id
          });
      }

      // Handle bulk scheduling
      if (newPost.bulkDates && newPost.bulkDates.length > 0) {
        await createBulkPosts(parentPost, newPost);
      }

      // Handle recurring posts
      if (newPost.isRecurring && newPost.recurringEndDate) {
        await createRecurringPosts(
          parentPost.id,
          selectedDate,
          newPost,
          newPost.recurringEndDate
        );
      }

      toast({
        title: "Success",
        description: "Your post has been scheduled.",
      });

      return true;
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

  const saveDraft = async (newPost: any, selectedDate: Date | undefined) => {
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
          status: 'draft'
        });

      if (error) throw error;

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

  return {
    createPost,
    saveDraft
  };
}
