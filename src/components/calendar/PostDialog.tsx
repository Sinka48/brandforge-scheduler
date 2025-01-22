import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
      <DialogContent className="w-[95vw] h-[90vh] max-w-[95vw] max-h-[90vh] p-0">
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <DialogHeader editMode={editMode} />
          </div>
          
          {!newPost ? (
            <LoadingState />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <PostDialogContent
                  newPost={newPost}
                  setNewPost={setNewPost}
                  handlePlatformToggle={handlePlatformToggle}
                  editMode={editMode}
                  onGenerateContent={handleQuickPost}
                  isGenerating={isGenerating}
                />
              </div>

              <div className="p-6 border-t">
                <DialogActions
                  onSaveAsDraft={handleDraftSubmit}
                  onAddPost={handleSubmit}
                  onPublish={handleSubmit}
                  isDisabled={!newPost.content.trim()}
                  editMode={editMode}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}