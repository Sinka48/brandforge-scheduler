import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { GeneratedContent } from "./campaign-dialog/GeneratedContent";
import { usePostState } from "@/hooks/usePostState";
import { usePostActions } from "@/hooks/usePostActions";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AICampaignDialog({
  isOpen,
  onOpenChange,
}: AICampaignDialogProps) {
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { createPost } = usePostActions("user-id"); // Replace "user-id" with actual user ID
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await createPost(newPost);
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewPost({
        content: '',
        platforms: [],
        image: '',
        time: '',
        status: 'draft',
        date: new Date(),
      });
    }
  }, [isOpen, setNewPost]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader 
          editMode={false} 
          previewMode="desktop"
          onPreviewModeChange={() => {}}
        />
        <GeneratedContent
          content={newPost.content}
          selectedPlatforms={newPost.platforms}
          imageUrl={newPost.image}
        />
        {/* Add other components like PostContent, DialogActions, etc. */}
      </DialogContent>
    </Dialog>
  );
}
