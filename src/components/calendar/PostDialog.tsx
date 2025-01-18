import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";

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
        title: "Platform Required",
        description: "Please select at least one social media platform for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your post before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.time) {
      toast({
        title: "Time Required",
        description: "Please select a posting time for your content.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader editMode={editMode} selectedDate={selectedDate} />
        
        {!newPost ? (
          <LoadingState />
        ) : (
          <>
            <PostDialogContent
              newPost={newPost}
              setNewPost={setNewPost}
              handlePlatformToggle={handlePlatformToggle}
              editMode={editMode}
            />

            <DialogActions
              onSaveAsDraft={handleDraftSubmit}
              onAddPost={handleSubmit}
              isDisabled={!newPost.content.trim()}
              editMode={editMode}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}