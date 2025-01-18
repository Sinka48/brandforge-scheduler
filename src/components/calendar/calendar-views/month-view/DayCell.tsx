import { format, isSameDay, isToday } from "date-fns";
import { PostIndicator } from "./PostIndicator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onView?: (post: Post) => void;
}

export function DayCell({ 
  date, 
  posts, 
  isSelected, 
  onSelect,
  onEdit,
  onDelete,
  onView 
}: DayCellProps) {
  const dayPosts = posts.filter(post => isSameDay(post.date, date));
  
  const getPostTitle = (content: string) => {
    const firstLine = content.split('\n')[0];
    return firstLine.length > 30 ? `${firstLine.substring(0, 30)}...` : firstLine;
  };

  return (
    <div
      className={cn(
        "h-full w-full p-2 rounded-md transition-all duration-200",
        isSelected && "ring-2 ring-primary",
        isToday(date) && "bg-accent/20",
        "group hover:bg-accent/40"
      )}
      onClick={() => onSelect(date)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-sm font-medium",
          isToday(date) && "text-primary font-bold"
        )}>
          {format(date, 'd')}
        </span>
      </div>
      
      {dayPosts.length > 0 && (
        <div className="space-y-1">
          {dayPosts.slice(0, 2).map((post) => (
            <HoverCard key={post.id} openDelay={200}>
              <HoverCardTrigger asChild>
                <div className={cn(
                  "text-xs p-1 rounded cursor-pointer transition-colors",
                  "hover:bg-accent",
                  post.status === 'draft' ? "border border-dashed border-muted-foreground" : "bg-accent/50"
                )}>
                  <div className="flex items-center gap-1 mb-1">
                    {post.platforms.map((platform) => (
                      <PostIndicator
                        key={platform}
                        platform={platform as any}
                        status={post.status}
                        size="xs"
                      />
                    ))}
                    {post.time && (
                      <span className="text-[10px] text-muted-foreground">
                        {post.time}
                      </span>
                    )}
                  </div>
                  <p className="truncate">{getPostTitle(post.content)}</p>
                </div>
              </HoverCardTrigger>
              
              <HoverCardContent align="start" className="w-80 p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {format(post.date, 'MMMM d, yyyy')}
                      {post.time && ` at ${post.time}`}
                    </p>
                    <Badge variant={post.status === 'draft' ? "outline" : "default"}>
                      {post.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.platforms.map((platform) => (
                      <PostIndicator
                        key={platform}
                        platform={platform as any}
                        status={post.status}
                      />
                    ))}
                  </div>
                  
                  <p className="text-sm line-clamp-3">{post.content}</p>
                  
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post preview" 
                      className="rounded-md max-h-32 object-cover"
                    />
                  )}
                  
                  <div className="flex items-center justify-end gap-2 mt-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(post);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(post);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(post.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
          
          {dayPosts.length > 2 && (
            <div className="text-xs text-muted-foreground text-center bg-accent/50 rounded-md p-1">
              +{dayPosts.length - 2} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}