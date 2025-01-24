import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { LogoCard } from "./LogoCard";
import { BrandSocialPreview } from "./BrandSocialPreview";
import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ColorPaletteCard } from "./ColorPaletteCard";

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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{brand?.metadata?.name || brandName}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Business & Brand Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Industry & Target Market</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Industry</span>
                      <span className="font-medium">{brand?.metadata?.industry || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Target Audience</span>
                      <span className="font-medium">{brand?.metadata?.targetAudience || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Brand Personality</h4>
                  <div className="flex flex-wrap gap-2">
                    {brand?.metadata?.brandPersonality ? (
                      Array.isArray(brand.metadata.brandPersonality) ? (
                        brand.metadata.brandPersonality.map((trait, index) => (
                          <Badge key={index} variant="secondary">
                            {trait}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary">{brand.metadata.brandPersonality}</Badge>
                      )
                    ) : (
                      <span className="text-sm text-muted-foreground">No personality traits specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand Story & Bio */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Brand Story</h4>
                  <p className="text-muted-foreground">
                    {brand?.metadata?.story || "AI will generate an engaging brand story"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Social Media Bio</h4>
                  <p className="text-muted-foreground">
                    {brand?.metadata?.socialBio || "AI will generate a compelling social media bio"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Color Palette Section */}
          {brand?.metadata?.colors && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Color Palette</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRegenerateAsset?.('colors')}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
                <ColorPaletteCard colors={brand.metadata.colors} />
              </div>
              <Separator />
            </>
          )}
          
          {/* Logo Section */}
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
          
          {/* Social Media Assets Section */}
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