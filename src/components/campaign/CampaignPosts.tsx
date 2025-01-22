import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostItem } from "../calendar/post-list/PostItem";
import { LoadingState } from "../calendar/post-list/LoadingState";
import { EmptyState } from "../calendar/post-list/EmptyState";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { useToast } from "@/hooks/use-toast";

interface CampaignPostsProps {
  campaignId: string;
}

export function CampaignPosts({ campaignId }: CampaignPostsProps) {
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['campaign-posts', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('scheduled_for', { ascending: true });

      if (error) {
        console.error('Error fetching campaign posts:', error);
        toast({
          title: "Error",
          description: "Failed to load campaign posts",
          variant: "destructive",
        });
        return [];
      }

      return data.map(post => ({
        id: post.id,
        content: post.content,
        date: new Date(post.scheduled_for),
        platforms: [post.platform as PlatformId],
        image: post.image_url,
        status: post.status as 'draft' | 'scheduled',
        time: new Date(post.scheduled_for).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }));
    }
  });

  const handleEditPost = async (post: any) => {
    console.log('Edit post:', post);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: 'scheduled' })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!posts || posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          platforms={PLATFORMS}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          onPublish={handlePublishPost}
        />
      ))}
    </div>
  );
}