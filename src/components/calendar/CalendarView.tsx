import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
}

export function CalendarView({ selectedDate, onSelectDate, posts = [] }: CalendarViewProps) {
  // Create a map of dates to post counts
  const postsByDate = posts.reduce((acc: Record<string, number>, post) => {
    if (post.status === 'scheduled') {
      const dateKey = format(post.date, 'yyyy-MM-dd');
      acc[dateKey] = (acc[dateKey] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <Card className="p-4">
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
        components={{
          DayContent: ({ date }) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const postCount = postsByDate[dateKey];
            
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                {date.getDate()}
                {postCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {postCount}
                  </Badge>
                )}
              </div>
            );
          }
        }}
      />
    </Card>
  );
}