import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { format } from "date-fns";
import { PlatformId } from "@/constants/platforms";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLATFORMS } from "@/constants/platforms";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
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
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
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
          status
        `)
        .eq('user_id', session.user.id)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data.map(post => ({
        id: post.id,
        content: post.content,
        date: new Date(post.scheduled_for),
        platforms: [post.platform as PlatformId],
        image: post.image_url,
        status: post.status as 'draft' | 'scheduled',
        time: format(new Date(post.scheduled_for), 'HH:mm')
      }));
    }
  });

  // Sort posts by scheduled time, earliest first
  const sortedPosts = [...posts].sort((a, b) => a.date.getTime() - b.date.getTime());

  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />
  }));

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Posts</h2>
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