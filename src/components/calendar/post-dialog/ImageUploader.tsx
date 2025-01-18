import { Button } from "@/components/ui/button";
import { Image, Upload, X } from "lucide-react";
import { useState } from "react";
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
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleFileChange}
      />
      
      {imageUrl ? (
        <div className="relative inline-block">
          <ImagePreview imageUrl={imageUrl} />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background shadow-sm"
            onClick={() => onImageUrlChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading}
        >
          <Image className="h-4 w-4" />
        </Button>
      )}
      
      <UploadProgress progress={uploadProgress} />
    </div>
  );
}