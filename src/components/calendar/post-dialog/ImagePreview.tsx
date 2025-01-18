interface ImagePreviewProps {
  imageUrl: string;
}

export function ImagePreview({ imageUrl }: ImagePreviewProps) {
  if (!imageUrl) return null;
  
  return (
    <img
      src={imageUrl}
      alt="Preview"
      className="h-10 w-10 rounded-md object-cover"
    />
  );
}