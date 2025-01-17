import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, Instagram, Twitter, Facebook, Linkedin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: {
    content: string;
    platforms: string[];
    image: string;
    time: string;
    status: 'scheduled' | 'draft';
  };
  setNewPost: (post: any) => void;
  handleAddPost: () => void;
  handleSaveAsDraft: () => void;
  handlePlatformToggle: (platformId: string) => void;
  selectedDate?: Date;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
];

export function PostDialog({
  isOpen,
  onOpenChange,
  newPost,
  setNewPost,
  handleAddPost,
  handleSaveAsDraft,
  handlePlatformToggle,
  selectedDate,
}: PostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </div>

          <Textarea
            placeholder="Write your post content..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="min-h-[100px]"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Platforms</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={newPost.platforms.includes(platform.id) ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  {platform.icon}
                  <span className="ml-2">{platform.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL (optional)</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter image URL..."
                value={newPost.image}
                onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <Image className="h-4 w-4" />
              </Button>
            </div>
            {newPost.image && (
              <img
                src={newPost.image}
                alt="Preview"
                className="mt-2 rounded-md max-h-32 object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={newPost.time}
                onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
            <Button onClick={handleAddPost}>
              Schedule Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}