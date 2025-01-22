import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { PlatformId } from "@/constants/platforms";
import { Post } from "../types";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
}

interface PostListContentProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: Platform[];
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
  console.log('PostListContent - posts:', posts);
  console.log('PostListContent - selectedDate:', selectedDate);

  // Filter posts based on selected date if one is provided
  const filteredPosts = selectedDate
    ? posts.filter(post => {
        const postDate = new Date(post.date);
        return (
          postDate.getFullYear() === selectedDate.getFullYear() &&
          postDate.getMonth() === selectedDate.getMonth() &&
          postDate.getDate() === selectedDate.getDate()
        );
      })
    : posts;

  console.log('PostListContent - filteredPosts:', filteredPosts);

  if (!filteredPosts || filteredPosts.length === 0) {
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
    </div>
  );
}