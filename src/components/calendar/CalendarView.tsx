import { Card } from "@/components/ui/card";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
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
  const scheduledPosts = posts.filter(post => post.status === 'scheduled');

  return (
    <Card className="p-4">
      <div className="text-center">
        <p className="text-muted-foreground">Calendar view is being updated...</p>
      </div>
    </Card>
  );
}