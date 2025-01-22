import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./post-dialog/DialogHeader";
import { DialogActions } from "./post-dialog/DialogActions";
import { DialogContent as PostDialogContent } from "./post-dialog/DialogContent";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./post-dialog/LoadingState";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimeSelector } from "./post-dialog/TimeSelector";

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: any;
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platformId: string) => void;
  selectedDate?: Date;
  editMode?: boolean;
}

export function PostDialog({
  isOpen,
  onOpenChange,
  newPost,
  setNewPost,
  handleAddPost,
  handleSaveAsDraft,
  handlePlatformToggle,
  selectedDate,
  editMode = false,
}: PostDialogProps) {
  const { toast } = useToast();

  const handleSubmit = () => {
    if (newPost.platforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one social media platform for your post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content to your post before publishing.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.time) {
      toast({
        title: "Time Required",
        description: "Please select a posting time for your content.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate) {
      toast({
        title: "Date Required",
        description: "Please select a date for your post.",
        variant: "destructive",
      });
      return;
    }

    handleAddPost();
  };

  const handleDraftSubmit = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add some content before saving as draft.",
        variant: "destructive",
      });
      return;
    }
    handleSaveAsDraft();
  };

  const handleQuickPost = async () => {
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platforms: newPost.platforms,
          topic: 'general', // You might want to make this configurable
        }),
      });

      if (!response.ok) throw new Error('Failed to generate post');

      const data = await response.json();
      setNewPost({ ...newPost, content: data.content });
      
      toast({
        title: "Content Generated",
        description: "AI has generated content for your post. Feel free to edit it!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate post content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-[95vw] max-h-[90vh] p-0">
        <div className="h-full flex flex-col">
          <div className="p-6 space-y-4">
            <DialogHeader editMode={editMode} />
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setNewPost({ ...newPost, date })}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <TimeSelector
                  time={newPost.time}
                  onTimeChange={(time) => setNewPost({ ...newPost, time })}
                  selectedPlatforms={newPost.platforms}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={handleQuickPost}
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
            </div>
          </div>
          
          {!newPost ? (
            <LoadingState />
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6">
                <PostDialogContent
                  newPost={newPost}
                  setNewPost={setNewPost}
                  handlePlatformToggle={handlePlatformToggle}
                  editMode={editMode}
                />
              </div>

              <div className="p-6 border-t">
                <DialogActions
                  onSaveAsDraft={handleDraftSubmit}
                  onAddPost={handleSubmit}
                  onPublish={handleSubmit}
                  isDisabled={!newPost.content.trim()}
                  editMode={editMode}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}