import { PlatformId } from "@/constants/platforms";
import { PostListContent } from "./post-list/PostListContent";
import { LoadingState } from "./post-list/LoadingState";
import { useState } from "react";
import { Post } from "./types";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface PostListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: readonly Platform[];
  handleDeletePost: (postId: string, deleteAll?: boolean) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  isLoading?: boolean;
  showScheduledOnly?: boolean;
}

export function PostList({ 
  selectedDate, 
  posts, 
  platforms, 
  handleDeletePost, 
  handleEditPost,
  handlePublishPost,
  isLoading,
  showScheduledOnly = false,
}: PostListProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  if (isLoading) {
    return <LoadingState />;
  }

  // Filter posts based on status if showScheduledOnly is true
  const filteredPosts = showScheduledOnly 
    ? posts.filter(post => post.status === 'scheduled')
    : posts;

  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <PostListContent
        selectedDate={selectedDate}
        posts={sortedPosts}
        platforms={platforms}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        handlePublishPost={handlePublishPost}
        showAllPosts={showAllPosts}
        setShowAllPosts={setShowAllPosts}
      />
    </div>
  );
}