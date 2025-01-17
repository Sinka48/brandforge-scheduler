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
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
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
        description: "Your post has been scheduled.",
      });

      return data;
    } catch (error) {
      console.error('Error adding post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSaveAsDraft = async (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platforms: newPost.platforms,
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
      });

      toast({
        title: "Success",
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
