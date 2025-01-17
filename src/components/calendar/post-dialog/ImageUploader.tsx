import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

interface ImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageUrlChange }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Image URL (optional)</label>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter image URL..."
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
        />
        <Button variant="outline" size="icon">
          <Image className="h-4 w-4" />
        </Button>
      </div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-2 rounded-md max-h-32 object-cover"
        />
      )}
    </div>
  );
}