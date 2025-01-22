import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { UploadProgress } from "./UploadProgress";

interface ImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageUrlChange }: ImageUploaderProps) {
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
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => document.getElementById('image-upload')?.click()}
        disabled={uploading}
      >
        <Upload className="h-4 w-4" />
      </Button>
      
      <UploadProgress progress={uploadProgress} />
    </div>
  );
}