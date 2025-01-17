import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onSaveAsDraft: () => void;
  onAddPost: () => void;
  isDisabled: boolean;
  editMode: boolean;
}

export function DialogActions({ 
  onSaveAsDraft, 
  onAddPost, 
  isDisabled,
  editMode 
}: DialogActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onSaveAsDraft}>
        Save as Draft
      </Button>
      <Button 
        onClick={onAddPost}
        disabled={isDisabled}
      >
        {editMode ? 'Update Post' : 'Schedule Post'}
      </Button>
    </div>
  );
}