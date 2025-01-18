import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlot {
  time: string;
  days: string[];
}

interface Template {
  id: string;
  name: string;
  topic: string;
  platforms: string[];
  duration: number;
  tone: string;
  time_slots: TimeSlot[];
  hashtags: string[];
}

interface LoadTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export function LoadTemplateDialog({ 
  isOpen, 
  onClose, 
  onSelectTemplate 
}: LoadTemplateDialogProps) {
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['campaign-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the Template type
      return (data as any[]).map(template => ({
        ...template,
        time_slots: JSON.parse(template.time_slots as string)
      })) as Template[];
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Load Campaign Template</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px] rounded-md border p-2">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No templates found
            </div>
          ) : (
            <div className="space-y-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {template.topic} - {template.platforms.join(', ')}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}