import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        head_cell: "text-muted-foreground rounded-md w-24 sm:w-32 font-normal text-[0.9rem] h-10",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
        day: "h-32 sm:h-40 w-24 sm:w-32 p-0 font-normal aria-selected:opacity-100 hover:bg-muted rounded-md",
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
      }}
      components={{
        DayContent: ({ date }) => {
          const dateKey = format(date, 'yyyy-MM-dd');
          const dayPosts = postsByDate[dateKey] || [];
          
          return (
            <div className="relative w-full h-full flex flex-col items-center justify-start p-2">
              <span className="text-sm font-medium mb-2">{date.getDate()}</span>
              {dayPosts.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                  <Badge 
                    variant="secondary" 
                    className="px-2 py-0.5 text-xs"
                  >
                    {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                  </Badge>
                  <ScrollArea className="h-20 w-full">
                    <div className="space-y-2">
                      {dayPosts.map((post) => (
                        <div 
                          key={post.id}
                          className="text-xs p-1 bg-muted rounded-sm"
                          title={post.content}
                        >
                          <div className="font-medium">{post.time}</div>
                          <div className="truncate text-muted-foreground">
                            {post.platforms[0]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          );
        }
      }}
    />
  );
}