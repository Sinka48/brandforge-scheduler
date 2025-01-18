import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface SaveTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignData: {
    topic: string;
    platforms: string[];
    duration: string;
    tone: string;
    timeSlots: { time: string; days: string[] }[];
    hashtags: string[];
  };
}

export function SaveTemplateDialog({ isOpen, onClose, campaignData }: SaveTemplateDialogProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('campaign_templates')
        .insert({
          name,
          topic: campaignData.topic,
          platforms: campaignData.platforms,
          duration: parseInt(campaignData.duration),
          tone: campaignData.tone,
          time_slots: campaignData.timeSlots,
          hashtags: campaignData.hashtags,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign template saved successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Campaign Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter template name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Template"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
