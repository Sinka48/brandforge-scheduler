import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { LogoCard } from "./LogoCard";

interface BrandLogoSectionProps {
  logoUrl: string;
  onRegenerateAsset?: (assetType: string) => void;
  onLogoCustomize?: () => void;
  onDownload?: () => void;
}

export function BrandLogoSection({
  logoUrl,
  onRegenerateAsset,
  onLogoCustomize,
  onDownload,
}: BrandLogoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Brand Logo</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRegenerateAsset?.('logo')}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </div>
      <LogoCard
        logoUrl={logoUrl}
        onCustomize={onLogoCustomize}
        onDownload={onDownload}
        compact
      />
    </div>
  );
}