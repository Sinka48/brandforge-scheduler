import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
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
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");

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
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto h-full max-w-7xl p-6">
          <div className="bg-background rounded-lg h-full flex flex-col shadow-lg">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
              <DialogHeader 
                editMode={editMode}
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
              />
            </div>
            
            {!newPost ? (
              <LoadingState />
            ) : (
              <>
                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full flex flex-col lg:flex-row">
                    {/* Left Column - Preview */}
                    <div className={cn(
                      "w-full lg:w-1/2 border-r p-6",
                      "overflow-y-auto"
                    )}>
                      <PostDialogContent
                        newPost={newPost}
                        setNewPost={setNewPost}
                        handlePlatformToggle={handlePlatformToggle}
                        editMode={editMode}
                        onGenerateContent={handleQuickPost}
                        isGenerating={isGenerating}
                        previewMode={previewMode}
                      />
                    </div>

                    {/* Right Column - Editor */}
                    <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
                      <div className="space-y-6">
                        {/* Editor components will be rendered here */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-background border-t px-6 py-4">
                  <DialogActions
                    onSaveAsDraft={handleDraftSubmit}
                    onAddPost={handleSubmit}
                    onPublish={handleSubmit}
                    isDisabled={!newPost.content.trim()}
                    editMode={editMode}
                    onGenerateContent={handleQuickPost}
                    isGenerating={isGenerating}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}