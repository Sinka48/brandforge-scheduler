import { Dialog } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');

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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className={cn(
            "relative w-full max-w-7xl h-[90vh] bg-background rounded-lg shadow-lg flex flex-col",
            "border border-border"
          )}>
            {/* Header Section */}
            <div className="sticky top-0 z-10 border-b bg-background p-4">
              <DialogHeader 
                editMode={editMode} 
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
              />
            </div>

            {/* Main Content Area */}
            {!newPost ? (
              <LoadingState />
            ) : (
              <div className="flex-1 overflow-hidden">
                <div className="flex h-full">
                  {/* Content */}
                  <DialogContent
                    newPost={newPost}
                    setNewPost={setNewPost}
                    handlePlatformToggle={handlePlatformToggle}
                    editMode={editMode}
                    onGenerateContent={handleQuickPost}
                    isGenerating={isGenerating}
                    previewMode={previewMode}
                  />
                </div>
              </div>
            )}

            {/* Footer Section */}
            <div className="sticky bottom-0 border-t bg-background p-4">
              <DialogActions
                onSaveAsDraft={handleDraftSubmit}
                onAddPost={handleSubmit}
                onPublish={handleSubmit}
                isDisabled={!newPost?.content.trim()}
                editMode={editMode}
                onGenerateContent={handleQuickPost}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}