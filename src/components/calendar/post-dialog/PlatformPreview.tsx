import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlatformLimits {
  maxLength: number;
  name: string;
}

const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  twitter: { maxLength: 280, name: 'Twitter' },
  facebook: { maxLength: 63206, name: 'Facebook' },
  instagram: { maxLength: 2200, name: 'Instagram' },
  linkedin: { maxLength: 3000, name: 'LinkedIn' },
};

interface PlatformPreviewProps {
  content: string;
  selectedPlatforms: string[];
}

export function PlatformPreview({ content, selectedPlatforms }: PlatformPreviewProps) {
  const getValidationIssues = () => {
    return selectedPlatforms.map(platform => {
      const limit = PLATFORM_LIMITS[platform];
      if (!limit) return null;
      
      if (content.length > limit.maxLength) {
        return {
          platform: limit.name,
          issue: `Content exceeds ${limit.name}'s ${limit.maxLength} character limit`
        };
      }
      return null;
    }).filter(Boolean);
  };

  const issues = getValidationIssues();

  if (issues.length === 0) return null;

  return (
    <div className="space-y-2">
      {issues.map((issue, index) => (
        <Alert variant="destructive" key={index}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {issue?.issue}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}