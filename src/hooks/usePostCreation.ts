import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function usePostCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPost = async (postData: any) => {
    if (!postData) {
      toast({
        title: "Error",
        description: "Post data is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPost,
    isLoading
  };
}
