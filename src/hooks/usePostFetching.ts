import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { PlatformId } from "@/constants/platforms";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
  campaign?: {
    id: string;
    name: string;
    description: string;
  };
}

export function usePostFetching(session: Session | null) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['posts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      console.log('Fetching posts for user:', session.user.id);
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
        console.error('Error fetching posts:', error);
        toast({
          title: "Error loading posts",
          description: "There was a problem loading your posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        console.log('No posts found');
        return [];
      }

      console.log('Posts fetched:', data);
      return data.map(post => ({
        id: post.id,
        content: post.content,
        date: new Date(post.scheduled_for),
        platforms: [post.platform as PlatformId], // Cast to PlatformId
        image: post.image_url,
        status: post.status as 'draft' | 'scheduled',
        time: format(new Date(post.scheduled_for), 'HH:mm'),
        campaign: post.campaigns ? {
          id: post.campaign_id,
          name: post.campaigns.name,
          description: post.campaigns.description
        } : undefined
      }));
    },
    enabled: !!session?.user,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 3
  });
}