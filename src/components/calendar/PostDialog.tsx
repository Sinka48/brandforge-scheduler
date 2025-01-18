import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }
    handleAddPost();
  };

  const handleDraftSubmit = () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform.",
        variant: "destructive",
      });
      return;
    }
    handleSaveAsDraft();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader editMode={editMode} selectedDate={selectedDate} />
        
        <PostDialogContent
          newPost={newPost}
          setNewPost={setNewPost}
          handlePlatformToggle={handlePlatformToggle}
          editMode={editMode}
        />

        <DialogActions
          onSaveAsDraft={handleDraftSubmit}
          onAddPost={handleSubmit}
          isDisabled={newPost.content.length === 0}
          editMode={editMode}
        />
      </DialogContent>
    </Dialog>
  );
}