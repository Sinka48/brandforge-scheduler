import { PlatformId } from "@/constants/platforms";
import { PostItem } from "./post-list/PostItem";
import { EmptyState } from "./post-list/EmptyState";
import { LoadingState } from "./post-list/LoadingState";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { isAfter, isSameDay, startOfDay } from "date-fns";

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
  const [showAllPosts, setShowAllPosts] = useState(false);
  
  if (isLoading) {
    return <LoadingState />;
  }

  // Filter posts based on selected date and upcoming status
  const now = startOfDay(new Date());
  const upcomingPosts = posts
    .filter(post => post.status === 'scheduled' && 
      (isAfter(post.date, now) || isSameDay(post.date, now)))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const filteredPosts = selectedDate
    ? posts.filter(post => isSameDay(post.date, selectedDate))
    : showAllPosts 
      ? upcomingPosts
      : upcomingPosts.slice(0, 3);

  if (filteredPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            className="transform transition-all duration-200 hover:translate-y-[-2px]"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fade-in 0.5s ease-out forwards'
            }}
          >
            <PostItem
              post={post}
              platforms={platforms}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              isSelected={selectedPosts.includes(post.id)}
              onSelect={onSelectPost}
            />
          </div>
        ))}
      </div>
      
      {!selectedDate && upcomingPosts.length > 3 && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            className="w-full hover:bg-accent transition-all duration-200 group"
            onClick={() => setShowAllPosts(!showAllPosts)}
          >
            <ChevronDown 
              className={`mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
                showAllPosts ? 'rotate-180' : ''
              }`} 
            />
            {showAllPosts ? "Show Less" : `Show ${upcomingPosts.length - 3} More Posts`}
          </Button>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}