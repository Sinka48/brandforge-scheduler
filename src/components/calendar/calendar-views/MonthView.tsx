import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { useMemo } from "react";
import { MonthViewDay } from "./month/MonthViewDay";
import { PostTooltip } from "./month/PostTooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

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
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function MonthView({ 
  selectedDate, 
  onSelectDate, 
  posts,
  onCreatePost,
  onPostClick 
}: MonthViewProps) {
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
      <PostTooltip date={date} posts={datePosts}>
        <MonthViewDay 
          date={date} 
          posts={datePosts} 
          isSelected={isSelected}
          onCreatePost={() => {
            onSelectDate(date);
            onCreatePost?.();
          }}
          onPostClick={onPostClick}
        />
      </PostTooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="animate-in fade-in-50 duration-500">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border-none p-0"
          components={{
            Day: ({ date }) => renderDateContent(date),
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center text-xl font-semibold mb-4",
            caption_label: "text-lg font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-[14.28%] font-normal text-sm p-2",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-[14.28%] h-32 border border-border",
            day: "h-full w-full p-0 font-normal aria-selected:opacity-100",
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
        />
      </div>
    </TooltipProvider>
  );
}