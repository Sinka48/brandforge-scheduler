import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Post } from "../types";
import { PlatformId } from "@/constants/platforms";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useCalendarData() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const { data: session, isLoading: authLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          throw error;
        }

        if (!session) {
          navigate('/');
          return null;
        }

        return session;
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate('/');
        return null;
      }
    },
    retry: false,
  });

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      console.log('Starting post fetch for user:', session?.user?.id);
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

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
            description
          )
        `)
        .eq('user_id', session.user.id)
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

      if (!data || data.length === 0) {
        console.log('No posts found for user');
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
    },
    enabled: !!session?.user,
  });

  return {
    session,
    posts,
    isLoading,
    error,
    authLoading
  };
}