import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Building2, Users, MessageSquare, Palette } from "lucide-react";
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
        <CardContent className="space-y-8">
          {/* Brand Overview Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold">{brand?.metadata?.name || brandName}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {brand?.metadata?.socialBio || "AI will generate a compelling social media bio for your brand"}
                  </p>
                </div>
                <div className="text-muted-foreground">
                  {brand?.metadata?.story || "AI will generate an engaging brand story"}
                </div>
              </div>
            </div>

            <LogoCard
              logoUrl={logoUrl}
              onCustomize={onLogoCustomize}
              onDownload={onDownload}
              compact
            />
          </div>

          <Separator />

          {/* Brand Attributes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Brand Attributes</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Industry & Business Info */}
              <Card className="p-4">
                <h4 className="font-medium mb-2">Business Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Industry:</span>
                    <p className="font-medium">{brand?.metadata?.industry || "Not specified"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Target Audience:</span>
                    <p className="font-medium">{brand?.metadata?.targetAudience || "Not specified"}</p>
                  </div>
                </div>
              </Card>

              {/* Brand Personality */}
              <Card className="p-4">
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
              </Card>
            </div>
          </div>

          <Separator />

          {/* Color Palette Section */}
          {brand?.metadata?.colors && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Color Palette</h3>
                  </div>
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