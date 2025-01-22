import { PlatformPreview } from "@/components/calendar/post-dialog/platform-previews/PlatformPreview";

interface GeneratedContentProps {
  content: any;
  selectedPlatforms: any[];
  imageUrl: any;
}

export function GeneratedContent({ content, selectedPlatforms, imageUrl }: GeneratedContentProps) {
  return (
    <div className="space-y-4">
      <PlatformPreview
        content={content}
        selectedPlatforms={selectedPlatforms}
        imageUrl={imageUrl}
        previewMode="desktop"
      />
    </div>
  );
}
