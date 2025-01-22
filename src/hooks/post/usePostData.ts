import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { PlatformId } from "@/constants/platforms";

export function usePostData(session: Session | null) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      console.log('Starting post fetch for user:', session?.user?.id);
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      try {
        console.log('Fetching posts with campaign data...');
        
        // Split the query into two parts and combine results
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
          .order('scheduled_for', { ascending: true });

        if (campaignError) {
          console.error('Supabase error fetching campaign posts:', campaignError);
          throw campaignError;
        }

        // Combine and deduplicate posts
        const allPosts = [...(scheduledPosts || []), ...(campaignPosts || [])];
        const uniquePosts = Array.from(new Map(allPosts.map(post => [post.id, post])).values());

        // Filter and format posts
        const formattedPosts = uniquePosts
          .filter(post => 
            post.status === 'scheduled' || 
            (post.campaign_id && post.campaigns?.status === 'active')
          )
          .map(post => ({
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
    refetchInterval: 5000, // Refresh every 5 seconds to catch new campaign posts
  });
}