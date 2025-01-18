import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { useMemo } from "react";
import { MonthViewDay } from "./month/MonthViewDay";
import { PostTooltip } from "./month/PostTooltip";
import { Tooltip } from "@/components/ui/tooltip";

export interface Post {
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
  // Memoize the posts by date calculation
  const postsByDate = useMemo(() => {
    return posts.reduce((acc: Record<string, Post[]>, post) => {
      if (post.status === 'scheduled') {
        const dateKey = format(post.date, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(post);
      }
      return acc;
    }, {});
  }, [posts]);

  const renderDateContent = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const datePosts = postsByDate[dateKey] || [];
    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

    return (
      <Tooltip>
        <PostTooltip date={date} posts={datePosts}>
          <MonthViewDay 
            date={date} 
            posts={datePosts} 
            isSelected={isSelected}
          />
        </PostTooltip>
      </Tooltip>
    );
  };

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        className="rounded-md"
        components={{
          Day: ({ date }) => renderDateContent(date),
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
    </div>
  );
}