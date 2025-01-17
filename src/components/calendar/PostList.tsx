import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
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
}

export function PostList({ selectedDate, posts, platforms, handleDeletePost }: PostListProps) {
  return (
    <div className="space-y-4">
      {posts
        .filter(
          (post) =>
            selectedDate &&
            post.date.toDateString() === selectedDate.toDateString()
        )
        .map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-md border bg-background"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                {post.platforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId);
                  return platform?.icon;
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {post.time}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post preview"
                className="mt-2 rounded-md max-h-32 object-cover"
              />
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              Status: {post.status}
            </div>
          </div>
        ))}
    </div>
  );
}