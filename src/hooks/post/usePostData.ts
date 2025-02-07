
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Post } from "@/components/calendar/types";
import { PlatformId } from "@/constants/platforms";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function usePostData(session: Session | null) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      try {
        console.log('Fetching posts for user:', session.user.id);
        
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
          .in('status', ['scheduled', 'draft'])
          .order('scheduled_for', { ascending: true });

        if (error) {
          console.error('Error fetching posts:', error);
          toast({
            title: "Error",
            description: "Failed to load posts. Please try again.",
            variant: "destructive",
          });
          throw error;
        }

        if (!posts) {
          console.log('No posts found');
          return [];
        }

        // Format posts for display
        const formattedPosts = posts.map(post => ({
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
        toast({
          title: "Error",
          description: "Failed to load posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!session?.user,
    refetchInterval: 5000, // Refresh every 5 seconds to catch newly scheduled posts
  });
}
