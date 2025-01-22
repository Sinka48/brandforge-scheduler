import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Post } from "@/components/calendar/types";
import { PlatformId } from "@/constants/platforms";

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
        console.log('Fetching scheduled posts...');
        
        // First, get scheduled posts
        const { data: scheduledPosts, error: scheduledError } = await supabase
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
          .eq('status', 'scheduled')
          .order('scheduled_for', { ascending: true });

        if (scheduledError) {
          console.error('Supabase error fetching scheduled posts:', scheduledError);
          throw scheduledError;
        }

        // Then, get posts from active campaigns
        const { data: campaignPosts, error: campaignError } = await supabase
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
          .not('campaign_id', 'is', null)
          .eq('campaigns.status', 'active')
          .order('scheduled_for', { ascending: true });

        if (campaignError) {
          console.error('Supabase error fetching campaign posts:', campaignError);
          throw campaignError;
        }

        // Combine and deduplicate posts
        const allPosts = [...(scheduledPosts || []), ...(campaignPosts || [])];
        const uniquePosts = Array.from(new Map(allPosts.map(post => [post.id, post])).values());

        // Format posts for display
        const formattedPosts = uniquePosts.map(post => ({
          id: post.id,
          content: post.content,
          date: new Date(post.scheduled_for),
          platforms: [post.platform as PlatformId],
          image: post.image_url,
          status: post.status as 'draft' | 'scheduled',
          time: new Date(post.scheduled_for).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
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