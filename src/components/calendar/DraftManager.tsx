import { PostList } from "./PostList";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
}

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: PlatformId[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
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
  
  // Filter to show only non-campaign draft posts
  const draftPosts = posts.filter(post => post.status === 'draft' && !post.campaign);

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
        const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
          body: { 
            content: post.content,
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
          platform: post.platforms[0], // Use the first selected platform
          scheduled_for: publishDate.toISOString()
        })
        .eq('id', postId);

      if (updateError) throw updateError;
      
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