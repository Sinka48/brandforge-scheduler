import { Card } from "@/components/ui/card";
import { PostList } from "../PostList";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { Post } from "../types";

interface CalendarContentProps {
  posts: Post[];
  selectedDate: Date | undefined;
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  isLoading: boolean;
}

export function CalendarContent({
  posts,
  selectedDate,
  handleDeletePost,
  handleEditPost,
  handlePublishPost,
  isLoading
}: CalendarContentProps) {
  const platforms = PLATFORMS.map(platform => ({
    ...platform,
    icon: <platform.icon className="h-4 w-4" />
  }));

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          <PostList
            selectedDate={selectedDate}
            posts={posts}
            platforms={platforms}
            handleDeletePost={handleDeletePost}
            handleEditPost={handleEditPost}
            handlePublishPost={handlePublishPost}
            isLoading={isLoading}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming posts scheduled</p>
          </div>
        )}
      </div>
    </Card>
  );
}