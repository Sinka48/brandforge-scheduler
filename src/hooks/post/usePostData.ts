import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Post } from "@/components/calendar/types";
import { PlatformId } from "@/constants/platforms";
import { format } from "date-fns";

export function usePostData(session: Session | null) {
  return useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      console.log('Starting post fetch for user:', session?.user?.id);
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      try {
        console.log('Fetching posts...');
        
        // Get both scheduled and draft posts
        const { data: allPosts, error: postsError } = await supabase
          .from('posts')
          .select(`
            id,
            content,
            scheduled_for,
            platform,
            image_url,
            status,
            campaign_id,
            campaigns (
              id,
              name,
              description,
              status
            )
          `)
          .eq('user_id', session.user.id)
          .in('status', ['scheduled', 'draft'])
          .order('scheduled_for', { ascending: true });

        if (postsError) {
          console.error('Supabase error fetching posts:', postsError);
          throw postsError;
        }

        // Format posts for display
        const formattedPosts = (allPosts || []).map(post => ({
          id: post.id,
          content: post.content,
          date: new Date(post.scheduled_for),
          platforms: [post.platform as PlatformId],
          image: post.image_url,
          status: post.status as 'draft' | 'scheduled',
          time: format(new Date(post.scheduled_for), 'HH:mm'),
          campaign: post.campaigns ? {
            id: post.campaign_id,
            name: post.campaigns.name,
            description: post.campaigns.description
          } : undefined
        }));

        console.log('Formatted posts:', formattedPosts);
        return formattedPosts;
      } catch (error) {
        console.error('Error in posts query:', error);
        throw error;
      }
    },
    enabled: !!session?.user,
    refetchInterval: 5000, // Refresh every 5 seconds to catch newly scheduled posts
  });
}