import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { format } from "date-fns";
import { PlatformId } from "@/constants/platforms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORMS } from "@/constants/platforms";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function CalendarView({ 
  selectedDate, 
  onSelectDate, 
  onCreatePost,
  onPostClick
}: CalendarViewProps) {
  const { toast } = useToast();

  // Check authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Fetch posts only if authenticated
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', authData?.user?.id],
    queryFn: async () => {
      if (!authData?.user) {
        console.log('No authenticated user found');
        return [];
      }

      console.log('Fetching posts for user:', authData.user.id);
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
        .eq('user_id', authData.user.id)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching posts:', error);
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
        platforms: [post.platform] as PlatformId[],
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
    enabled: !!authData?.user,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchOnWindowFocus: true,
    retry: 3
  });

  // Handle errors with toast notifications
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading posts",
        description: "There was a problem loading your posts. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Sort posts by scheduled time, earliest first
  const sortedPosts = [...(posts || [])].sort((a, b) => a.date.getTime() - b.date.getTime());

  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />
  }));

  if (authLoading) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </Card>
    );
  }

  if (!authData?.user) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to view your posts</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading posts. Please try again.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          <PostList
            selectedDate={selectedDate}
            posts={sortedPosts}
            platforms={platforms}
            handleDeletePost={() => {}}
            handleEditPost={() => {}}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming posts scheduled</p>
          </div>
        )}
      </div>
    </Card>
  );
}