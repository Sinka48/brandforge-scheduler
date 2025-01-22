import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onSaveAsDraft: () => void;
  onAddPost: () => void;
  onPublish: () => void;
  isDisabled: boolean;
  editMode: boolean;
}

export function DialogActions({ 
  onSaveAsDraft, 
  onAddPost,
  onPublish,
  isDisabled,
  editMode 
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
        {editMode ? 'Update & Publish' : 'Publish Now'}
      </Button>
    </div>
  );
}