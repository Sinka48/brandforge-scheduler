import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlatformIndicators } from "./PlatformIndicators";
import { Post } from "../MonthView";

interface MonthViewDayProps {
  date: Date;
  posts: Post[];
  isSelected: boolean;
}

export function MonthViewDay({ date, posts, isSelected }: MonthViewDayProps) {
  return (
    <div 
      className={cn(
        "relative w-full h-full group p-2",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "transition-all duration-200"
      )}
      role="button"
      tabIndex={0}
      aria-label={`${format(date, 'MMMM d, yyyy')}${posts.length > 0 ? `, ${posts.length} posts scheduled` : ''}`}
    >
      <div className={cn(
        "h-8 w-8 p-0 font-normal flex items-center justify-center rounded-full transition-colors mb-1",
        isToday(date) && "bg-primary text-primary-foreground",
        posts.length > 0 && "font-semibold",
        "group-hover:bg-accent/50",
        isSelected && "ring-2 ring-primary"
      )}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1 mt-2">
        {posts.slice(0, 3).map((post) => (
          <div 
            key={post.id}
            className="text-xs truncate text-left p-1 rounded bg-accent/40 hover:bg-accent transition-colors"
            title={post.content}
          >
            {post.content}
          </div>
        ))}
        {posts.length > 3 && (
          <div className="text-xs text-muted-foreground pl-1">
            +{posts.length - 3} more
          </div>
        )}
      </div>
      
      <PlatformIndicators posts={posts} />
      
      {posts.length > 0 && (
        <div className="absolute -top-1 -right-1">
          <Badge
            variant="secondary"
            className={cn(
              "h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center",
              "animate-in fade-in-50 duration-300"
            )}
          >
            {posts.length}
          </Badge>
        </div>
      )}
    </div>
  );
}