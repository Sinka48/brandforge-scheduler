import { PlatformId } from "@/constants/platforms";
import { PostListContent } from "./post-list/PostListContent";
import { LoadingState } from "./post-list/LoadingState";
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
  parent_post_id?: string;
  campaign?: {
    id: string;
    name: string;
    description: string;
  };
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