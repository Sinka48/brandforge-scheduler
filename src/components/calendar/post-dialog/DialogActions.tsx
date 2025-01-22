import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DialogActionsProps {
  onSaveAsDraft: () => void;
  onAddPost: () => void;
  onPublish: () => void;
  isDisabled: boolean;
  editMode: boolean;
  isPublishing?: boolean;
}

export function DialogActions({ 
  onSaveAsDraft, 
  onAddPost,
  onPublish,
  isDisabled,
  editMode,
  isPublishing = false
}: DialogActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onSaveAsDraft}>
        Save as Draft
      </Button>
      <Button 
        variant="outline"
        onClick={onAddPost}
        disabled={isDisabled}
      >
        Schedule
      </Button>
      <Button 
        onClick={onPublish}
        disabled={isDisabled}
      >
        {isPublishing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          editMode ? 'Update & Publish' : 'Publish Now'
        )}
      </Button>
    </div>
  );
}