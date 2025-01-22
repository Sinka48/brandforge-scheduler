import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActions } from "./post-dialog/DialogActions";
import { PostDialogContent } from "./post-dialog/PostDialogContent";
import { usePostState } from "@/hooks/usePostState";
import { usePostCreate } from "@/hooks/post/usePostCreate";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: any;
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platform: string) => void;
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      // Add your AI content generation logic here
      toast({
        title: "Content Generated",
        description: "Your post content has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isDisabled = !newPost.content || newPost.platforms.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <PostDialogContent
          newPost={newPost}
          setNewPost={setNewPost}
          handlePlatformToggle={handlePlatformToggle}
          editMode={editMode}
          onGenerateContent={handleGenerateContent}
          isGenerating={isGenerating}
        />
        <div className="p-4 border-t sticky bottom-0 bg-background z-10">
          <DialogActions
            onSaveAsDraft={handleSaveAsDraft}
            onAddPost={handleAddPost}
            onPublish={handleAddPost}
            isDisabled={isDisabled}
            editMode={editMode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}