import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface DialogActionsProps {
  onSaveAsDraft: () => void;
  onAddPost: () => void;
  onPublish: () => void;
  onGenerateContent: () => void;
  isDisabled: boolean;
  editMode: boolean;
  isGenerating: boolean;
}

export function DialogActions({ 
  onSaveAsDraft, 
  onAddPost,
  onPublish,
  onGenerateContent,
  isDisabled,
  editMode,
  isGenerating
}: DialogActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        onClick={onGenerateContent}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate with AI"}
      </Button>

      <div className="flex gap-2">
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