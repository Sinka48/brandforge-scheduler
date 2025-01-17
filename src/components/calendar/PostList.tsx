import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, Edit, Trash2, AlertCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostAnalytics } from "@/components/calendar/PostAnalytics";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
  isRecurring?: boolean;
  recurringPattern?: string;
  recurringEndDate?: Date;
  batch_id?: string;
}

interface PostListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: {
    id: string;
    name: string;
    icon: React.ReactNode;
  }[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  isLoading?: boolean;
}

export function PostList({ 
  selectedDate, 
  posts, 
  platforms, 
  handleDeletePost, 
  handleEditPost,
  isLoading 
}: PostListProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-md border bg-background">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const filteredPosts = posts.filter(
    (post) =>
      selectedDate &&
      post.date.toDateString() === selectedDate.toDateString()
  );

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-12 w-12 opacity-50" />
          <p>No posts scheduled for this date</p>
        </div>
        <Button variant="outline" size="sm">
          Create your first post
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <div
          key={post.id}
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
                  onClick={() => handleEditPost(post)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDeletePost(post.id)}
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
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              >
                {expandedPost === post.id ? 'Hide Analytics' : 'Show Analytics'}
              </Button>
            )}
          </div>
          {expandedPost === post.id && post.platforms.map((platform) => (
            <div key={platform} className="mt-4">
              <PostAnalytics postId={post.id} platform={platform} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
