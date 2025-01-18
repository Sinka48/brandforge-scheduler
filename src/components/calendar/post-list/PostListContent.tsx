import { PostItem } from "./PostItem";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { filterPostsByDate } from "../utils/dateUtils";

interface PostListContentProps {
  selectedDate: Date | undefined;
  posts: any[];
  platforms: any[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: any) => void;
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
  showAllPosts,
  setShowAllPosts,
  selectedPosts = [],
  onSelectPost
}: PostListContentProps) {
  const filteredPosts = filterPostsByDate(posts, selectedDate);
  const displayPosts = selectedDate
    ? filteredPosts
    : showAllPosts 
      ? filteredPosts
      : filteredPosts.slice(0, 3);

  if (filteredPosts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {displayPosts.map((post, index) => (
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
      
      {!selectedDate && filteredPosts.length > 3 && (
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
            {showAllPosts ? "Show Less" : `Show ${filteredPosts.length - 3} More Posts`}
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