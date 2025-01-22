import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "../types";
import { PlatformId } from "@/constants/platforms";

export function useCalendarData() {
  const { toast } = useToast();

  const { data: session, isLoading: authLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to check authentication status. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      console.log('Auth session:', session);
      return session;
    },
  });

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      console.log('Starting post fetch for user:', session?.user?.id);
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      try {
        // First get all direct posts and posts from active campaigns
        const { data, error } = await supabase
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
          .or('campaign_id.is.null,campaign_id.not.is.null,campaigns.status.eq.active')
          .order('scheduled_for', { ascending: true });

        if (error) {
          console.error('Supabase error fetching posts:', error);
          toast({
            title: "Error loading posts",
            description: "There was a problem loading your posts. Please try again.",
            variant: "destructive",
          });
          throw error;
        }

        console.log('Raw posts data from Supabase:', data);

        if (!data) {
          console.log('No posts found');
          return [];
        }

        const formattedPosts = data.map(post => ({
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

  return {
    session,
    posts,
    isLoading,
    error,
    authLoading
  };
}