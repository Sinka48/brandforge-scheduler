import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export function MediaLibrary({ isOpen, onClose, onSelectImage }: MediaLibraryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ['media-library'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: posts, error } = await supabase
        .from('posts')
        .select('image_url')
        .eq('user_id', session.user.id)
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique image URLs
      const uniqueImages = [...new Set(posts.map(post => post.image_url))];
      return uniqueImages.filter(Boolean) as string[];
    }
  });

  const handleSelect = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !images?.length ? (
            <div className="text-center p-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No images found in your library</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`
                      relative aspect-square rounded-md overflow-hidden cursor-pointer
                      border-2 transition-all
                      ${selectedImage === imageUrl ? 'border-primary' : 'border-transparent hover:border-muted'}
                    `}
                    onClick={() => setSelectedImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Library image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSelect} disabled={!selectedImage}>
              Select Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}