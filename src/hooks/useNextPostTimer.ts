import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useNextPostTimer() {
  const [timeLeft, setTimeLeft] = useState<string>("No upcoming posts");
  const [hasUpcomingPosts, setHasUpcomingPosts] = useState(false);

  const { data: posts = [] } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('posts')
        .select('scheduled_for')
        .eq('user_id', session.user.id)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data.map(post => ({
        date: new Date(post.scheduled_for),
      }));
    }
  });

  // Sort posts by scheduled time, earliest first
  const sortedPosts = [...posts].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find next upcoming post and calculate time left
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const nextPost = sortedPosts.find(post => post.date > now);
      
      if (nextPost) {
        const timeUntilPost = formatDistanceToNow(nextPost.date, { addSuffix: true });
        setTimeLeft(timeUntilPost);
        setHasUpcomingPosts(true);
      } else {
        setTimeLeft("No upcoming posts");
        setHasUpcomingPosts(false);
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [sortedPosts]);

  return { timeLeft, hasUpcomingPosts };
}