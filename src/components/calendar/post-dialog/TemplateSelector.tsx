import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Folder, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  name: string;
  content: string;
  platforms: string[];
  image_url?: string;
  is_favorite: boolean;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_templates')
        .select('*')
        .order('is_favorite', { ascending: false });

      if (error) throw error;
      return data as Template[];
    },
  });

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Folder className="h-4 w-4 mr-2" />
        Load Template
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ScrollArea className="h-[300px] rounded-md border p-2">
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading templates...
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No templates found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onSelectTemplate(template);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {template.content}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}