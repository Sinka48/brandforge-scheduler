import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isSameDay } from "date-fns";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface DayViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  posts?: Post[];
}

export function DayView({ selectedDate, posts = [] }: DayViewProps) {
  if (!selectedDate) return null;

  const dayPosts = posts.filter(
    (post) => post.status === 'scheduled' && isSameDay(post.date, selectedDate)
  ).sort((a, b) => {
    if (!a.time || !b.time) return 0;
    return a.time.localeCompare(b.time);
  });

  return (
    <Card className="p-4 md:p-6">
      <div className="text-lg md:text-xl font-semibold mb-4">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </div>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {dayPosts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No posts scheduled for this day
            </div>
          ) : (
            dayPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="text-lg font-medium">{post.time}</div>
                    <div className="text-muted-foreground break-words">
                      {post.content}
                    </div>
                    {post.image && (
                      <img 
                        src={post.image} 
                        alt="Post preview" 
                        className="mt-2 rounded-md max-w-[200px] w-full object-cover"
                      />
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.platforms.map((platform) => (
                        <Badge key={platform} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}