import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { PlatformId } from "@/constants/platforms";
import { Post } from "../types";
import { isSameDay } from "date-fns";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface PostListContentProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: readonly Platform[];
  handleDeletePost: (postId: string, deleteAll?: boolean) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  showAllPosts: boolean;
  setShowAllPosts: (show: boolean) => void;
}

export function PostListContent({
  selectedDate,
  posts,
  platforms,
  handleDeletePost,
  handleEditPost,
  handlePublishPost,
  showAllPosts,
  setShowAllPosts,
}: PostListContentProps) {
  // Filter posts based on selected date if it exists
  const filteredPosts = selectedDate
    ? posts.filter(post => isSameDay(new Date(post.date), selectedDate))
    : posts;

  if (!posts || posts.length === 0) {
    return <EmptyState />;
  }

  // Show all posts if showAllPosts is true, otherwise show only the first 5
  const displayPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, 5);

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          platforms={platforms}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onPublish={handlePublishPost}
        />
      ))}
      {filteredPosts.length > 5 && !showAllPosts && (
        <button
          onClick={() => setShowAllPosts(true)}
          className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Show more posts...
        </button>
      )}
      {filteredPosts.length === 0 && selectedDate && (
        <EmptyState />
      )}
    </div>
  );
}