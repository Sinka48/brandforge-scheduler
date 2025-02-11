
import { PostList } from "./PostList";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "lucide-react";
import { Post } from "./types";
import { useQueryClient } from "@tanstack/react-query";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface DraftManagerProps {
  posts: Post[];
  platforms: readonly Platform[];
  handleDeletePost: (postId: string) => void;
  handleEditPost: (post: Post) => void;
  isLoading?: boolean;
}

export function DraftManager({
  posts,
  platforms,
  handleDeletePost,
  handleEditPost,
  isLoading
}: DraftManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter to show only draft posts (both campaign and non-campaign)
  const draftPosts = posts.filter(post => post.status === 'draft');

  const handlePublishPost = async (postId: string) => {
    try {
      // Find the post to get its platform
      const post = posts.find(p => p.id === postId);
      if (!post || !post.platforms || post.platforms.length === 0) {
        toast({
          title: "Error",
          description: "No platform selected for this post.",
          variant: "destructive",
        });
        return;
      }

      const publishDate = new Date();

      // If it's a Twitter post, publish it immediately using the edge function
      if (post.platforms.includes('twitter')) {
        const storedKeys = sessionStorage.getItem('twitter_keys');
        if (!storedKeys) {
          toast({
            title: "Twitter Configuration Required",
            description: "Please configure your Twitter API keys in the Settings page first.",
            variant: "destructive",
          });
          return;
        }

        const keys = JSON.parse(storedKeys);
        const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
          body: { 
            content: post.content,
            keys,
            imageUrl: post.image 
          }
        });

        if (tweetError) throw tweetError;
      }

      // Update the post status in the database
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          status: 'scheduled',
          published_at: publishDate.toISOString(),
          platform: post.platforms[0],
          scheduled_for: publishDate.toISOString()
        })
        .eq('id', postId);

      if (updateError) throw updateError;
      
      // Invalidate the posts query to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: "Success",
        description: "Post has been published",
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <PostList
        selectedDate={undefined}
        posts={draftPosts}
        platforms={platforms}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        handlePublishPost={handlePublishPost}
        isLoading={isLoading}
      />
    </div>
  );
}
