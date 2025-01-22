import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { GeneratedContent } from "./campaign-dialog/GeneratedContent";
import { usePostState } from "@/hooks/usePostState";
import { usePostActions } from "@/hooks/usePostActions";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AICampaignDialog({
  isOpen,
  onOpenChange,
}: AICampaignDialogProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");
  const { newPost, setNewPost, handlePlatformToggle } = usePostState();
  const { createPost } = usePostActions("user-id"); // Replace "user-id" with actual user ID
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const postData = {
        content: newPost.content,
        platform: newPost.platforms[0] || "", // Take first platform or empty string
        image_url: newPost.image,
        scheduled_for: new Date().toISOString(), // Current time as default
        status: newPost.status,
      };
      
      await createPost(postData);
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      setNewPost({
        content: "",
        platforms: [],
        image: "",
        time: "",
        status: "draft",
        date: new Date(),
      });
    }
  }, [isOpen, setNewPost]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader 
          editMode={false} 
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
          selectedPlatforms={newPost.platforms}
          onPlatformToggle={handlePlatformToggle}
        />
        <GeneratedContent
          content={newPost.content}
          selectedPlatforms={newPost.platforms}
          imageUrl={newPost.image}
        />
      </DialogContent>
    </Dialog>
  );
}