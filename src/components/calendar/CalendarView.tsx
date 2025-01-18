import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { PlatformId } from "@/constants/platforms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORMS } from "@/constants/platforms";
import { usePostFetching } from "@/hooks/usePostFetching";
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