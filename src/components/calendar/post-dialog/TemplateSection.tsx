import { TemplateSelector } from "./TemplateSelector";
import { SaveTemplateDialog } from "./SaveTemplateDialog";

interface TemplateSectionProps {
  onSelectTemplate: (template: any) => void;
  content: string;
  platforms: string[];
  imageUrl: string;
}

export function TemplateSection({ 
  onSelectTemplate, 
  content, 
  platforms, 
  imageUrl 
}: TemplateSectionProps) {
  return (
    <div className="flex gap-2">
      <TemplateSelector onSelectTemplate={onSelectTemplate} />
      <SaveTemplateDialog
        content={content}
        platforms={platforms}
        imageUrl={imageUrl}
      />
    </div>
  );
}