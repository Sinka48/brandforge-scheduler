import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlatformIndicators } from "./PlatformIndicators";
import { Post } from "../MonthView";
import { Facebook, Twitter, Instagram, Linkedin, Clock, CheckCircle2 } from "lucide-react";

interface MonthViewDayProps {
  date: Date;
  posts: Post[];
  isSelected: boolean;
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook className="h-3 w-3" />,
  twitter: <Twitter className="h-3 w-3" />,
  instagram: <Instagram className="h-3 w-3" />,
  linkedin: <Linkedin className="h-3 w-3" />,
};

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
      
      <div className="space-y-1.5 mt-2">
        {posts.map((post) => (
          <button 
            key={post.id}
            className="w-full group text-left text-xs p-1.5 rounded-md bg-accent/40 hover:bg-accent transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPostClick?.(post);
            }}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              {platformIcons[post.platforms[0]]}
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-[10px]">{post.time}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                {post.status === 'scheduled' && (
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                )}
                <Badge 
                  variant={post.status === 'scheduled' ? 'default' : 'secondary'}
                  className="h-4 px-1 text-[10px]"
                >
                  {post.status}
                </Badge>
              </div>
            </div>
            <p className="line-clamp-2 text-[11px] group-hover:text-primary transition-colors">
              {post.content}
            </p>
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