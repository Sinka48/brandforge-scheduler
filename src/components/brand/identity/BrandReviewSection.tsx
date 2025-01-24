import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Share2, RefreshCw } from "lucide-react";
import { LogoCard } from "./LogoCard";
import { BrandSocialPreview } from "./BrandSocialPreview";
import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";

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
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Social Assets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Brand Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{brand?.metadata?.name || brandName}</h3>
              <p className="text-muted-foreground">
                {brand?.metadata?.socialBio || "Add a social media bio to describe your brand"}
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Logo Concept</h3>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assets">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Media Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}