import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

export function ImageUploader({ imageUrl, onImageUrlChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setUploadProgress(0);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, file, {
          upsert: false,
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      onImageUrlChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
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
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Image className="h-4 w-4" />
        </Button>
      </div>
      
      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="h-2" />
      )}
      
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