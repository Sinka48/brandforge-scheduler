import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface WeekViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  posts?: Post[];
}

export function WeekView({ selectedDate, onSelectDate, posts = [] }: WeekViewProps) {
  if (!selectedDate) return null;

  const startDate = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 h-full">
      {weekDays.map((day) => {
        const dayPosts = posts.filter(
          (post) => post.status === 'scheduled' && isSameDay(post.date, day)
        );

        return (
          <Card 
            key={day.toString()}
            className={`p-4 ${isSameDay(day, selectedDate) ? 'ring-2 ring-primary' : ''}`}
            onClick={() => onSelectDate(day)}
          >
            <div className="text-sm font-medium mb-2">
              <div className="md:hidden">{format(day, 'EEE, MMM d')}</div>
              <div className="hidden md:block">
                <div>{format(day, 'EEE')}</div>
                <div className="text-2xl mt-1">{format(day, 'd')}</div>
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2">
                {dayPosts.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No posts
                  </div>
                ) : (
                  dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-2 bg-muted rounded-md text-sm"
                    >
                      <div className="font-medium">{post.time}</div>
                      <div className="truncate text-muted-foreground">
                        {post.content}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {post.platforms[0]}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>
        );
      })}
    </div>
  );
}