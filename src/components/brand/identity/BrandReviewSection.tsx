import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Download } from "lucide-react";
import { LogoCard } from "./LogoCard";
import { BrandSocialPreview } from "./BrandSocialPreview";
import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BrandReviewSectionProps {
  brandName?: string;
  logoUrl: string;
  brand?: Brand;
  onLogoCustomize?: () => void;
  onDownload?: () => void;
  onRegenerateAsset?: (assetType: string) => void;
}

export function BrandReviewSection({
  brandName = "Your Brand",
  logoUrl,
  brand,
  onLogoCustomize,
  onDownload,
  onRegenerateAsset,
}: BrandReviewSectionProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Brand Identity Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">{brand?.metadata?.name || brandName}</h3>
              <p className="text-muted-foreground">
                {brand?.metadata?.socialBio || "Add a social media bio to describe your brand"}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Brand Story</h4>
              <p className="text-muted-foreground">
                {brand?.metadata?.story || "Share your brand's story and journey"}
              </p>
            </div>
          </div>

          <Separator />
          
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
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Assets</h3>
            {brand ? (
              <BrandSocialPreview
                brand={brand}
                onRegenerateAsset={onRegenerateAsset}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                No social media assets found. Generate a brand identity first.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}