import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isAfter, startOfToday } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface MonthViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  posts: Post[];
}

export function MonthView({ selectedDate, onSelectDate, posts }: MonthViewProps) {
  const today = startOfToday();
  const upcomingPosts = posts
    .filter(post => post.status === 'scheduled' && isAfter(post.date, today))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Create a map of dates to posts
  const postsByDate = posts.reduce((acc: Record<string, Post[]>, post) => {
    if (post.status === 'scheduled') {
      const dateKey = format(post.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(post);
    }
    return acc;
  }, {});

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md"
        modifiers={{
          hasPost: (date) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            return !!postsByDate[dateKey];
          }
        }}
        modifiersStyles={{
          hasPost: {
            fontWeight: 'bold',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)'
          }
        }}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4 w-full",
          caption: "flex justify-center pt-1 relative items-center text-lg font-semibold",
          caption_label: "text-base font-medium",
          nav: "space-x-1 flex items-center",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_hidden: "invisible",
        }}
      />

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Upcoming Posts</h3>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {upcomingPosts.map((post) => (
              <div 
                key={post.id}
                className="relative pl-6 pb-4 border-l-2 border-muted last:pb-0"
              >
                <div className="absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {format(post.date, 'MMM d')} at {post.time}
                  </div>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}