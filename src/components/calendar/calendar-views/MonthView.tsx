import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
} from "date-fns";
import { DayCell } from "./month-view/DayCell";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Added cn import

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
  posts?: Post[];
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
  onViewPost?: (post: Post) => void;
}

export function MonthView({
  selectedDate,
  onSelectDate,
  posts = [],
  selectedPosts = [],
  onSelectPost,
  onEditPost,
  onDeletePost,
  onViewPost,
}: MonthViewProps) {
  if (!selectedDate) return null;

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weeks = Math.ceil(days.length / 7);

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div 
        className="grid grid-cols-7 gap-1"
        style={{ 
          gridTemplateRows: `repeat(${weeks}, minmax(100px, 1fr))` 
        }}
      >
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "border rounded-md transition-colors",
              !isSameMonth(day, monthStart) && "opacity-50 bg-muted",
            )}
          >
            <DayCell
              date={day}
              posts={posts}
              isSelected={selectedDate ? isSameMonth(day, selectedDate) : false}
              onSelect={onSelectDate}
              onEdit={onEditPost}
              onDelete={onDeletePost}
              onView={onViewPost}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
