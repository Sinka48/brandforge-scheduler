import { Button } from "@/components/ui/button";
import { PostList } from "./PostList";
import { PlatformId, PLATFORMS } from "@/constants/platforms";
import { FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectDraft = (postId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDrafts.length === posts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(posts.map(post => post.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedDrafts.length === 0) return;

    toast({
      title: `Delete ${selectedDrafts.length} drafts?`,
      description: "This action cannot be undone.",
      action: (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            selectedDrafts.forEach(id => handleDeletePost(id));
            setSelectedDrafts([]);
            toast({
              title: "Drafts deleted",
              description: `${selectedDrafts.length} drafts have been deleted.`
            });
          }}
        >
          Delete
        </Button>
      ),
    });
  };

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
          platform: post.platforms[0],
          scheduled_for: publishDate.toISOString()
        })
        .eq('id', postId)
        .select();  // Add .select() to ensure we get the updated record

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
      <div className="flex items-center justify-between">
        {selectedDrafts.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedDrafts.length})
          </Button>
        )}
      </div>

      {posts.length > 0 && (
        <div className="flex items-center gap-2 py-2">
          <Checkbox
            checked={selectedDrafts.length === posts.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedDrafts.length === 0 
              ? "Select all"
              : `${selectedDrafts.length} selected`}
          </span>
        </div>
      )}

      <PostList
        selectedDate={undefined}
        posts={posts}
        platforms={platforms}
        handleDeletePost={handleDeletePost}
        handleEditPost={handleEditPost}
        handlePublishPost={handlePublishPost}
        isLoading={isLoading}
        selectedPosts={selectedDrafts}
        onSelectPost={handleSelectDraft}
      />
    </div>
  );
}