import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format, set } from "date-fns";

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

    if (newPost.status === 'scheduled' && !newPost.time) {
      toast({
        title: "Time Required",
        description: "Please select a time for scheduling your post.",
        variant: "destructive",
      });
      return;
    }

    // Create a proper timestamp by combining the selected date with the time
    if (selectedDate && newPost.time) {
      const [hours, minutes] = newPost.time.split(':').map(Number);
      const scheduledDate = set(selectedDate, {
        hours,
        minutes,
        seconds: 0,
        milliseconds: 0
      });
      
      // Update the newPost with the properly formatted date
      setNewPost({
        ...newPost,
        date: scheduledDate
      });
    }

    // Handle immediate Twitter publishing
    if (newPost.platforms.includes('twitter') && newPost.status !== 'draft') {
      setIsPublishing(true);
      try {
        const { data: tweetResult, error: tweetError } = await supabase.functions.invoke('publish-tweet', {
          body: { 
            content: newPost.content,
            imageUrl: newPost.image 
          }
        });

        if (tweetError) throw tweetError;

        toast({
          title: "Tweet Published",
          description: "Your tweet has been published successfully!",
        });
      } catch (error) {
        console.error('Error publishing tweet:', error);
        toast({
          title: "Publishing Failed",
          description: "Failed to publish tweet. Please try again.",
          variant: "destructive",
        });
        return;
      } finally {
        setIsPublishing(false);
      }
    }

    handleAddPost();
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

      if (error) {
        console.error('Error generating post:', error);
        throw error;
      }

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
                  onAddPost={handleSubmit}
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