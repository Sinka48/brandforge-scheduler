import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface DialogActionsProps {
  onSaveAsDraft: () => void;
  onAddPost: () => void;
  onPublish: () => void;
  isDisabled: boolean;
  editMode: boolean;
  onGenerateContent: () => void;
  isGenerating: boolean;
}

export function DialogActions({ 
  onSaveAsDraft, 
  onAddPost,
  onPublish,
  isDisabled,
  editMode,
  onGenerateContent,
  isGenerating
}: DialogActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <Button
          variant="outline"
          onClick={onGenerateContent}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate with AI"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
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
    </div>
  );
}