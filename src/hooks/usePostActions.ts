import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export function usePostActions() {
  const { toast } = useToast();

  const createPost = async (postData: {
    content: string;
    platforms: string[];
    image: string;
    time: string;
    status: 'scheduled' | 'draft';
  }, selectedDate: Date | undefined) => {
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
          content: postData.content,
          platforms: postData.platforms,
          image_url: postData.image || null,
          scheduled_for: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(postData.time.split(':')[0]),
            parseInt(postData.time.split(':')[1])
          ).toISOString(),
          status: postData.status
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: postData.status === 'draft' 
          ? "Your post has been saved as a draft."
          : "Your post has been scheduled.",
      });

      return data;
    } catch (error) {
      console.error('Error with post:', error);
      toast({
        title: "Error",
        description: `Failed to ${postData.status === 'draft' ? 'save' : 'schedule'} post. Please try again.`,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    createPost,
  };
}