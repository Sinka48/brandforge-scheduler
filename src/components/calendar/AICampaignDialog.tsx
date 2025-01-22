import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { useState } from "react";

interface AICampaignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateCampaign: () => void;
}

export function AICampaignDialog({
  isOpen,
  onOpenChange,
  onGenerateCampaign,
}: AICampaignDialogProps) {
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("desktop");
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader 
          editMode={false}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">Generate Campaign</h2>
          <p className="text-sm text-muted-foreground">
            Use AI to generate your campaign content.
          </p>
          <button
            onClick={onGenerateCampaign}
            className="mt-4 btn btn-primary"
          >
            Generate Campaign
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
