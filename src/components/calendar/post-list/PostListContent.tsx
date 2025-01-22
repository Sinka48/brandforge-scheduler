import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { PlatformId } from "@/constants/platforms";
import { Post } from "../types";
import { isSameDay, startOfDay } from "date-fns";
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
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
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
  selectedPosts = [],
  onSelectPost
}: PostListContentProps) {
  console.log('PostListContent - All posts:', posts);
  console.log('PostListContent - selectedDate:', selectedDate);

  // Filter posts based on selectedDate or show upcoming posts
  const filteredPosts = selectedDate
    ? posts.filter(post => isSameDay(new Date(post.date), selectedDate))
    : posts.filter(post => {
        const postDate = new Date(post.date);
        const today = startOfDay(new Date());
        return postDate >= today;
      });

  console.log('PostListContent - filteredPosts:', filteredPosts);

  if (!posts || posts.length === 0) {
    return <EmptyState />;
  }

  const displayPosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, 3);

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
          isSelected={selectedPosts.includes(post.id)}
          onSelect={onSelectPost}
        />
      ))}
      {filteredPosts.length === 0 && selectedDate && (
        <EmptyState />
      )}
    </div>
  );
}