import { PlatformId } from "@/constants/platforms";
import { PostItem } from "./post-list/PostItem";
import { EmptyState } from "./post-list/EmptyState";
import { LoadingState } from "./post-list/LoadingState";

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
}

interface PostListProps {
  selectedDate: Date | undefined;
  posts: Post[];
  platforms: Platform[];
  handleDeletePost: (postId: string, deleteAll?: boolean) => void;
  handleEditPost: (post: Post) => void;
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
  isLoading,
  selectedPosts = [],
  onSelectPost
}: PostListProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  const filteredPosts = selectedDate
    ? posts.filter(post => post.date.toDateString() === selectedDate.toDateString())
    : posts;

  if (filteredPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          platforms={platforms}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          isSelected={selectedPosts.includes(post.id)}
          onSelect={onSelectPost}
        />
      ))}
    </div>
  );
}