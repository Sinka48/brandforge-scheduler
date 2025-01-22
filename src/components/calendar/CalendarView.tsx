import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORMS } from "@/constants/platforms";
import { useToast } from "@/hooks/use-toast";
import {
  LoadingState,
  AuthCheckingState,
  UnauthenticatedState,
  ErrorState
} from "./CalendarStates";

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
  const queryClient = useQueryClient();
  
  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

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

        const formattedPosts = data.map(post => {
          console.log('Processing post:', post);
          return {
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
          };
        });

        console.log('Formatted posts:', formattedPosts);
        return formattedPosts;
      } catch (error) {
        console.error('Error in posts query:', error);
        throw error;
      }
    },
    enabled: !!session?.user,
  });

  const handlePublishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          status: 'scheduled',
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: "Success",
        description: "Post scheduled for publishing",
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    console.log('Auth loading...');
    return <AuthCheckingState />;
  }

  if (!session) {
    console.log('No session found');
    return <UnauthenticatedState />;
  }

  if (error) {
    console.error('Error in CalendarView:', error);
    return <ErrorState />;
  }

  if (isLoading) {
    console.log('Posts loading...');
    return <LoadingState />;
  }

  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />
  }));

  console.log('Final posts being rendered:', posts);
  console.log('Selected date:', selectedDate);

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          <PostList
            selectedDate={selectedDate}
            posts={posts}
            platforms={platforms}
            handleDeletePost={handleDeletePost}
            handleEditPost={handleEditPost}
            handlePublishPost={handlePublishPost}
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
