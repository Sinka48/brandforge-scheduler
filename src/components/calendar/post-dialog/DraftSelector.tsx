import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { FileText } from "lucide-react";

interface DraftSelectorProps {
  onSelectDraft: (draft: {
    content: string;
    platforms: string[];
    image_url?: string;
  }) => void;
  content: string;
  platforms: string[];
  imageUrl: string;
}

export function DraftSelector({ 
  onSelectDraft,
}: DraftSelectorProps) {
  const { data: drafts = [], isLoading } = useQuery({
    queryKey: ['drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        <h3 className="text-sm font-medium">Load from Drafts</h3>
      </div>
      
      <ScrollArea className="h-[200px] rounded-md border">
        <div className="p-2 space-y-2">
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading drafts...
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No drafts found
            </div>
          ) : (
            drafts.map((draft) => (
              <Button
                key={draft.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onSelectDraft({
                    content: draft.content,
                    platforms: [draft.platform],
                    image_url: draft.image_url,
                  });
                }}
              >
                <div className="flex flex-col items-start">
                  <p className="text-sm line-clamp-1">{draft.content}</p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}