interface ImagePreviewProps {
  imageUrl: string;
}

export function ImagePreview({ imageUrl }: ImagePreviewProps) {
  if (!imageUrl) return null;
  
  return (
    <img
      src={imageUrl}
      alt="Preview"
      className="mt-2 rounded-md max-h-32 object-cover"
    />
  );
}