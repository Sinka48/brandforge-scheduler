import { PlatformId } from "@/constants/platforms";
import { PostListContent } from "./post-list/PostListContent";
import { LoadingState } from "./post-list/LoadingState";
import { useState } from "react";
import { Post } from "./types";
import { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  
  if (isLoading) {
    return <LoadingState />;
  }

  const sortedPosts = [...posts].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleDelete = async (postId: string, deleteAll?: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw error;
      }

      // Call the parent handler to update UI state
      handleDeletePost(postId, deleteAll);

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <PostListContent
        selectedDate={selectedDate}
        posts={sortedPosts}
        platforms={platforms}
        handleDeletePost={handleDelete}
        handleEditPost={handleEditPost}
        handlePublishPost={handlePublishPost}
        showAllPosts={showAllPosts}
        setShowAllPosts={setShowAllPosts}
        selectedPosts={selectedPosts}
        onSelectPost={onSelectPost}
      />
    </div>
  );
}