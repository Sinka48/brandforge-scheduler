import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Library } from "lucide-react";
import { useState } from "react";
import { MediaLibrary } from "./MediaLibrary";
import { useImageUpload } from "@/hooks/useImageUpload";
import { ImagePreview } from "./ImagePreview";
import { UploadProgress } from "./UploadProgress";

interface ImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageUrlChange }: ImageUploaderProps) {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const { uploading, uploadProgress, handleFileUpload } = useImageUpload(onImageUrlChange);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Image</label>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
        />
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMediaLibraryOpen(true)}
        >
          <Library className="h-4 w-4" />
        </Button>
      </div>
      
      <UploadProgress progress={uploadProgress} />
      <ImagePreview imageUrl={imageUrl} />

      <MediaLibrary
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={onImageUrlChange}
      />
    </div>
  );
}