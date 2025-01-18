import { Card } from "@/components/ui/card";
import { PostList } from "./PostList";
import { format, isAfter, startOfDay } from "date-fns";
import { PlatformId } from "@/constants/platforms";

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
  posts?: Post[];
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function CalendarView({ 
  selectedDate, 
  onSelectDate, 
  posts = [],
  onCreatePost,
  onPostClick
}: CalendarViewProps) {
  // Filter out draft posts, only show scheduled posts
  const scheduledPosts = posts
    .filter(post => post.status === 'scheduled')
    .filter(post => isAfter(post.date, startOfDay(new Date())))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Upcoming Posts</h2>
        {scheduledPosts.length > 0 ? (
          <PostList
            selectedDate={selectedDate}
            posts={scheduledPosts}
            platforms={[]}
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