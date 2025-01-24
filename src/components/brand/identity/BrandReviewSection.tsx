import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand } from "@/types/brand";
import { Separator } from "@/components/ui/separator";
import { BrandOverviewSection } from "./BrandOverviewSection";
import { BrandLogoSection } from "./BrandLogoSection";
import { ColorPaletteCard } from "./ColorPaletteCard";
import { BrandSocialPreview } from "./BrandSocialPreview";

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
          {/* Brand Overview Section */}
          <BrandOverviewSection
            brandName={brand?.metadata?.name || brandName}
            industry={brand?.metadata?.industry}
            targetAudience={brand?.metadata?.targetAudience}
            brandPersonality={brand?.metadata?.brandPersonality}
            story={brand?.metadata?.story}
            socialBio={brand?.metadata?.socialBio}
          />

          <Separator />

          {/* Logo Section */}
          <BrandLogoSection
            logoUrl={logoUrl}
            onRegenerateAsset={onRegenerateAsset}
            onLogoCustomize={onLogoCustomize}
            onDownload={onDownload}
          />

          <Separator />

          {/* Color Palette Section */}
          {brand?.metadata?.colors && (
            <>
              <div className="space-y-4">
                <ColorPaletteCard colors={brand.metadata.colors} />
              </div>
              <Separator />
            </>
          )}
          
          {/* Social Media Assets Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Social Media Assets</h3>
            </div>
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