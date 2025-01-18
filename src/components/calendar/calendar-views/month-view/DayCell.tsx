import { format, isSameDay } from "date-fns";
import { PostIndicator } from "./PostIndicator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface DayCellProps {
  date: Date;
  posts: Post[];
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

export function DayCell({ date, posts, isSelected, onSelect }: DayCellProps) {
  const dayPosts = posts.filter(post => isSameDay(post.date, date));
  
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button
          onClick={() => onSelect(date)}
          className={cn(
            "h-full w-full p-2 hover:bg-accent/50 rounded-md transition-colors",
            isSelected && "ring-2 ring-primary"
          )}
        >
          <div className="text-sm font-medium">
            {format(date, 'd')}
          </div>
          
          {dayPosts.length > 0 && (
            <div className="mt-1 space-y-1">
              {dayPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="text-xs">
                  {post.platforms.map((platform) => (
                    <PostIndicator
                      key={platform}
                      platform={platform as any}
                      status={post.status}
                    />
                  ))}
                </div>
              ))}
              {dayPosts.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{dayPosts.length - 2} more
                </div>
              )}
            </div>
          )}
        </button>
      </HoverCardTrigger>
      
      {dayPosts.length > 0 && (
        <HoverCardContent align="start" className="w-80">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {format(date, 'MMMM d, yyyy')}
            </p>
            <div className="space-y-3">
              {dayPosts.map((post) => (
                <div key={post.id} className="space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {post.platforms.map((platform) => (
                      <PostIndicator
                        key={platform}
                        platform={platform as any}
                        status={post.status}
                      />
                    ))}
                  </div>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  {post.time && (
                    <p className="text-xs text-muted-foreground">
                      {post.time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}