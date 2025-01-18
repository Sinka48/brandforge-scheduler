import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useBulkScheduling() {
  const [isLoading, setIsLoading] = useState(false);

  const schedulePosts = async (posts: any[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(posts);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error scheduling posts:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    schedulePosts,
    isLoading
  };
}