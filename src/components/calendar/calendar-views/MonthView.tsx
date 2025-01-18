import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, isAfter, startOfToday, isToday } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Clock, Instagram, Linkedin, Twitter } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PlatformId } from "@/constants/platforms";

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

const platformColors: Record<PlatformId, string> = {
  instagram: "bg-pink-500",
  linkedin: "bg-blue-500",
  twitter: "bg-sky-500",
};

const platformIcons: Record<PlatformId, React.ReactNode> = {
  instagram: <Instagram className="h-3 w-3" />,
  linkedin: <Linkedin className="h-3 w-3" />,
  twitter: <Twitter className="h-3 w-3" />,
};

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

  const renderDateContent = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const datePosts = postsByDate[dateKey] || [];
    const platforms = Array.from(new Set(datePosts.flatMap(post => post.platforms)));

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative w-full h-full">
              <div className={cn(
                "h-9 w-9 p-0 font-normal",
                isToday(date) && "bg-primary text-primary-foreground rounded-full",
                datePosts.length > 0 && "font-semibold"
              )}>
                {date.getDate()}
              </div>
              {platforms.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5">
                  {platforms.map((platform) => (
                    <div
                      key={platform}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        platformColors[platform as PlatformId]
                      )}
                    />
                  ))}
                </div>
              )}
              {datePosts.length > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Badge
                    variant="secondary"
                    className="h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
                  >
                    {datePosts.length}
                  </Badge>
                </div>
              )}
            </div>
          </TooltipTrigger>
          {datePosts.length > 0 && (
            <TooltipContent>
              <div className="space-y-1">
                {datePosts.map((post) => (
                  <div key={post.id} className="flex items-center gap-1 text-xs">
                    {platformIcons[post.platforms[0] as PlatformId]}
                    <span className="truncate max-w-[200px]">{post.content}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6">
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

      <Card className="p-4">
        <h3 className="font-semibold mb-4">Upcoming Posts</h3>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {upcomingPosts.map((post) => (
              <div 
                key={post.id}
                className="relative pl-6 pb-4 border-l-2 border-muted last:pb-0 animate-fade-in"
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
                      <Badge 
                        key={platform} 
                        variant="secondary" 
                        className={cn(
                          "text-xs flex items-center gap-1",
                          platformColors[platform as PlatformId]
                        )}
                      >
                        {platformIcons[platform as PlatformId]}
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