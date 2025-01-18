import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRecurringPosts() {
  const [isLoading, setIsLoading] = useState(false);

  const createRecurringPost = async (postData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData]);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating recurring post:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRecurringPost,
    isLoading
  };
}