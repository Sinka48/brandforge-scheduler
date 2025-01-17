import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Trash2, Copy } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PostAnalytics } from "@/components/calendar/PostAnalytics";
import { PlatformId } from "@/constants/platforms";
import { useState } from "react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
  batch_id?: string;
}

interface PostItemProps {
  post: Post;
  platforms: Platform[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostItem({ post, platforms, onEdit, onDelete }: PostItemProps) {
  const [expandedAnalytics, setExpandedAnalytics] = useState(false);

  return (
    <div
      className={cn(
        "p-4 rounded-md border transition-colors",
        post.status === 'draft' ? 'bg-muted/50' : 'bg-background hover:bg-accent/5'
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2">
          {post.platforms.map((platformId) => {
            const platform = platforms.find(p => p.id === platformId);
            return platform?.icon;
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {post.batch_id && (
              <Badge variant="secondary">
                <Copy className="h-3 w-3 mr-1" />
                Bulk Post
              </Badge>
            )}
            {post.isRecurring && (
              <Badge variant="secondary">
                Recurring ({post.recurringPattern})
              </Badge>
            )}
            <Badge variant={post.status === 'draft' ? "secondary" : "default"}>
              {post.status}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(post)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(post.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="text-sm mb-3 line-clamp-3">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post preview"
          className="mt-2 rounded-md max-h-32 object-cover w-full"
        />
      )}
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          {post.time || format(post.date, 'HH:mm')}
        </div>
        {post.status === 'scheduled' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpandedAnalytics(!expandedAnalytics)}
          >
            {expandedAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
        )}
      </div>
      {expandedAnalytics && post.platforms.map((platform) => (
        <div key={platform} className="mt-4">
          <PostAnalytics postId={post.id} platform={platform} />
        </div>
      ))}
    </div>
  );
}