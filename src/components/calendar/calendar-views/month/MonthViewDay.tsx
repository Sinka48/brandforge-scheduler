import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlatformIndicators } from "./PlatformIndicators";
import { Post } from "../MonthView";

interface MonthViewDayProps {
  date: Date;
  posts: Post[];
  isSelected: boolean;
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function MonthViewDay({ 
  date, 
  posts, 
  isSelected,
  onCreatePost,
  onPostClick 
}: MonthViewDayProps) {
  return (
    <div 
      className={cn(
        "relative w-full h-full p-2",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        posts.length === 0 && "cursor-pointer hover:bg-accent/50 transition-colors"
      )}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (posts.length === 0 && onCreatePost) {
          onCreatePost();
        }
      }}
      aria-label={`${format(date, 'MMMM d, yyyy')}${posts.length > 0 ? `, ${posts.length} posts scheduled` : ''}`}
    >
      <div className={cn(
        "h-8 w-8 p-0 font-normal flex items-center justify-center rounded-full",
        isToday(date) && "bg-primary text-primary-foreground",
        posts.length > 0 && "font-semibold",
        isSelected && "ring-2 ring-primary"
      )}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1 mt-2">
        {posts.map((post) => (
          <button 
            key={post.id}
            className="w-full text-left text-xs truncate p-1 rounded bg-accent/40 hover:bg-accent transition-colors"
            title={post.content}
            onClick={(e) => {
              e.stopPropagation();
              onPostClick?.(post);
            }}
          >
            {post.content}
          </button>
        ))}
      </div>
      
      <PlatformIndicators posts={posts} />
      
      {posts.length > 0 && (
        <div className="absolute -top-1 -right-1">
          <Badge
            variant="secondary"
            className="h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
          >
            {posts.length}
          </Badge>
        </div>
      )}
    </div>
  );
}