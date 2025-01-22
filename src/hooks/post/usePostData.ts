import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
        console.log('Fetching scheduled posts...');
        
        // Fetch all scheduled posts (both manual and campaign posts)
        const { data: posts, error } = await supabase
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

        if (error) {
          console.error('Supabase error fetching posts:', error);
          throw error;
        }

        // Format posts for display
        const formattedPosts = (posts || []).map(post => ({
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