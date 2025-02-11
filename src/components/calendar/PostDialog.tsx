
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: any;
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platformId: string) => void;
  selectedDate?: Date;
  editMode?: boolean;
}

export function PostDialog({
  isOpen,
  onOpenChange,
  newPost,
  setNewPost,
  handleAddPost,
  handleSaveAsDraft,
  handlePlatformToggle,
  selectedDate,
  editMode = false,
}: PostDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSubmit = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your post before publishing.",
        variant: "destructive",
      });
      return;
    }

    // Create a proper timestamp for immediate publishing
    const publishDate = new Date();
    setNewPost({
      ...newPost,
      date: publishDate,
      status: 'scheduled',
      time: format(publishDate, 'HH:mm'),
      campaign_id: null // Ensure no campaign association for single posts
    });

    // Handle immediate Twitter publishing
    if (newPost.platforms.includes('twitter')) {
      setIsPublishing(true);
      try {
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
            content: newPost.content,
            keys,
            imageUrl: newPost.image 
          }
        });

        if (tweetError) throw tweetError;

        // Update post status in database
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            status: 'scheduled',
            published_at: publishDate.toISOString(),
            platform: newPost.platforms[0],
            scheduled_for: publishDate.toISOString(),
            campaign_id: null // Ensure no campaign association
          })
          .match({ id: newPost.id });

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "Your post has been published!",
        });

        await queryClient.invalidateQueries({ queryKey: ['posts'] });
        onOpenChange(false);
      } catch (error) {
        console.error('Error publishing post:', error);
        toast({
          title: "Publishing Failed",
          description: "Failed to publish post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsPublishing(false);
      }
    } else {
      handleAddPost();
    }
  };

  const handleDraftSubmit = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content before saving as draft.",
        variant: "destructive",
      });
      return;
    }

    // Ensure the draft is saved without a campaign association
    const draftPost = {
      ...newPost,
      campaign_id: null,
      status: 'draft'
    };
    
    setNewPost(draftPost);
    handleSaveAsDraft();
  };

  const handleQuickPost = async () => {
    try {
      if (!newPost.platforms || newPost.platforms.length === 0) {
        toast({
          title: "Platform Required",
          description: "Please select at least one platform before generating content.",
          variant: "destructive",
        });
        return;
      }

      setIsGenerating(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate posts.",
          variant: "destructive",
        });
        return;
      }

      console.log('Generating post for platforms:', newPost.platforms);

      const { data, error } = await supabase.functions.invoke('generate-post', {
        body: {
          platforms: newPost.platforms,
          topic: 'general',
        },
      });

      if (error) throw error;

      setNewPost({ ...newPost, content: data.content });
      
      toast({
        title: "Content Generated",
        description: "AI has generated content for your post. Feel free to edit it!",
      });

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Failed to generate post:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate post content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[550px] h-[85vh] max-h-[700px] p-0">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <DialogHeader editMode={editMode} />
          </div>
          
          {!newPost ? (
            <LoadingState />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                <PostDialogContent
                  newPost={newPost}
                  setNewPost={setNewPost}
                  handlePlatformToggle={handlePlatformToggle}
                  editMode={editMode}
                  onGenerateContent={handleQuickPost}
                  isGenerating={isGenerating}
                />
              </div>

              <div className="p-4 border-t">
                <DialogActions
                  onSaveAsDraft={handleDraftSubmit}
                  onAddPost={handleAddPost}
                  onPublish={handleSubmit}
                  isDisabled={!newPost.content.trim() || isPublishing}
                  editMode={editMode}
                  isPublishing={isPublishing}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
