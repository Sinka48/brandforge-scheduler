import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORMS } from "@/constants/platforms";
import { usePostFetching } from "@/hooks/usePostFetching";
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
  
  // Check authentication status
  const { data: session, isLoading: authLoading } = useQuery({
    queryKey: ['auth-session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  // Fetch posts using the custom hook
  const { data: posts = [], isLoading, error } = usePostFetching(session);

  if (authLoading) {
    return <AuthCheckingState />;
  }

  if (!session) {
    return <UnauthenticatedState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />
  }));

  // Sort posts by scheduled time
  const sortedPosts = [...posts].sort((a, b) => a.date.getTime() - b.date.getTime());

  const handleEditPost = async (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
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

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {isLoading ? (
          <LoadingState />
        ) : sortedPosts.length > 0 ? (
          <PostList
            selectedDate={selectedDate}
            posts={sortedPosts}
            platforms={platforms}
            handleDeletePost={handleDeletePost}
            handleEditPost={handleEditPost}
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