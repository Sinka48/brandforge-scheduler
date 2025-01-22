import { PlatformId } from "@/constants/platforms";
import { PostListContent } from "./post-list/PostListContent";
import { LoadingState } from "./post-list/LoadingState";
import { useState } from "react";
import { Post } from "./types";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
}

interface PostListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: Platform[];
  handleDeletePost: (postId: string, deleteAll?: boolean) => void;
  handleEditPost: (post: Post) => void;
  handlePublishPost: (postId: string) => void;
  isLoading?: boolean;
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
}

export function PostList({ 
  selectedDate, 
  posts, 
  platforms, 
  handleDeletePost, 
  handleEditPost,
  handlePublishPost,
  isLoading,
  selectedPosts = [],
  onSelectPost
}: PostListProps) {
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  console.log('PostList - Received posts:', posts);
  console.log('PostList - Selected date:', selectedDate);
  
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PostListContent
      selectedDate={selectedDate}
      posts={posts}
      platforms={platforms}
      handleDeletePost={handleDeletePost}
      handleEditPost={handleEditPost}
      handlePublishPost={handlePublishPost}
      showAllPosts={showAllPosts}
      setShowAllPosts={setShowAllPosts}
      selectedPosts={selectedPosts}
      onSelectPost={onSelectPost}
    />
  );
}