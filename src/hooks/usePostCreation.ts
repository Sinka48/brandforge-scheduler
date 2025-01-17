import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { usePostState } from "./usePostState";
import { createRecurringPosts } from "./useRecurringPosts";
import { createBulkPosts } from "./useBulkScheduling";
import { format } from "date-fns";

export function usePostCreation() {
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { toast } = useToast();

  const handleAddPost = async (selectedDate: Date | undefined) => {
    if (!selectedDate && !newPost.bulkDates?.length) {
      toast({
        title: "Error",
        description: "Please select at least one date.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!newPost.content) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Handle bulk scheduling
      if (newPost.bulkDates && newPost.bulkDates.length > 0) {
        // Create parent post for the batch
        const { data: parentPost, error: parentError } = await supabase
          .from('posts')
          .insert({
            content: newPost.content,
            platform: newPost.platforms[0],
            image_url: newPost.image || null,
            scheduled_for: new Date(
              newPost.bulkDates[0].getFullYear(),
              newPost.bulkDates[0].getMonth(),
              newPost.bulkDates[0].getDate(),
              parseInt(newPost.time.split(':')[0]),
              parseInt(newPost.time.split(':')[1])
            ).toISOString(),
            status: 'scheduled'
          })
          .select()
          .single();

        if (parentError) throw parentError;

        await createBulkPosts(parentPost, newPost);

        setNewPost({
          content: '',
          platforms: [],
          image: '',
          time: format(new Date(), 'HH:mm'),
          status: 'scheduled',
          isRecurring: false,
          recurringPattern: 'daily',
          bulkDates: [],
        });
        
        toast({
          title: "Success",
          description: `Successfully scheduled ${newPost.bulkDates.length} posts.`,
        });

        return parentPost;
      }

      // Handle single or recurring post
      const { data: parentPost, error: parentError } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: newPost.platforms[0],
          image_url: newPost.image || null,
          scheduled_for: new Date(
            selectedDate!.getFullYear(),
            selectedDate!.getMonth(),
            selectedDate!.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'scheduled',
          is_recurring: newPost.isRecurring,
          recurrence_pattern: newPost.isRecurring ? newPost.recurringPattern : null,
          recurrence_end_date: newPost.isRecurring ? newPost.recurringEndDate?.toISOString() : null
        })
        .select()
        .single();

      if (parentError) throw parentError;

      // Create posts for additional platforms
      for (let i = 1; i < newPost.platforms.length; i++) {
        await supabase
          .from('posts')
          .insert({
            content: newPost.content,
            platform: newPost.platforms[i],
            image_url: newPost.image || null,
            scheduled_for: new Date(
              selectedDate!.getFullYear(),
              selectedDate!.getMonth(),
              selectedDate!.getDate(),
              parseInt(newPost.time.split(':')[0]),
              parseInt(newPost.time.split(':')[1])
            ).toISOString(),
            status: 'scheduled',
            is_recurring: newPost.isRecurring,
            recurrence_pattern: newPost.isRecurring ? newPost.recurringPattern : null,
            recurrence_end_date: newPost.isRecurring ? newPost.recurringEndDate?.toISOString() : null,
            parent_post_id: parentPost.id
          });
      }

      // If this is a recurring post, create the series
      if (newPost.isRecurring && newPost.recurringEndDate) {
        await createRecurringPosts(parentPost.id, selectedDate!, newPost, newPost.recurringEndDate);
      }

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
        isRecurring: false,
        recurringPattern: 'daily',
        bulkDates: [],
      });
      
      toast({
        title: "Success",
        description: newPost.isRecurring 
          ? "Your recurring posts have been scheduled."
          : "Your post has been scheduled.",
      });

      return parentPost;
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return false;
    
    try {
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
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: format(new Date(), 'HH:mm'),
        status: 'scheduled',
        isRecurring: false,
        recurringPattern: 'daily',
      });
      
      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });

      return data;
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
    newPost,
    setNewPost,
    handleAddPost,
    handleSaveAsDraft,
    handlePlatformToggle,
  };
}
