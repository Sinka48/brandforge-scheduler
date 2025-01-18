import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Type, Palette, Image as ImageIcon, Share2, BookOpen } from "lucide-react";
import { ColorPaletteCard } from "./ColorPaletteCard";
import { TypographyCard } from "./TypographyCard";
import { LogoCard } from "./LogoCard";
import { LogoGuidelinesCard } from "./LogoGuidelinesCard";
import { FacebookPreview } from "../../calendar/post-dialog/platform-previews/FacebookPreview";
import { LinkedinPreview } from "../../calendar/post-dialog/platform-previews/LinkedinPreview";

interface BrandReviewSectionProps {
  brandName?: string;
  tagline?: string;
  brandStory?: string;
  colors: string[];
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  logoUrl: string;
  onColorUpdate?: (colors: string[]) => void;
  onLogoCustomize?: () => void;
  onDownload?: () => void;
}

export function BrandReviewSection({
  brandName = "Your Brand",
  tagline = "Your brand tagline",
  brandStory = "Your brand story",
  colors,
  typography,
  logoUrl,
  onColorUpdate,
  onLogoCustomize,
  onDownload,
}: BrandReviewSectionProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="colors" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Colors
        </TabsTrigger>
        <TabsTrigger value="typography" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Typography
        </TabsTrigger>
        <TabsTrigger value="logo" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Logo Guidelines
        </TabsTrigger>
        <TabsTrigger value="assets" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Social Assets
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{brandName}</h3>
                <p className="text-muted-foreground">{tagline}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Brand Story</h4>
                <p className="text-sm text-muted-foreground">{brandStory}</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <LogoCard
              logoUrl={logoUrl}
              onCustomize={onLogoCustomize}
              onDownload={onDownload}
            />
            <ColorPaletteCard
              colors={colors}
              onCustomize={onColorUpdate}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="colors">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Palette Customization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ColorPaletteCard
              colors={colors}
              onCustomize={onColorUpdate}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="typography">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyCard
              typography={typography}
              onCustomize={(typography) => console.log("Customize typography:", typography)}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logo">
        <div className="grid gap-6">
          <LogoCard
            logoUrl={logoUrl}
            onCustomize={onLogoCustomize}
            onDownload={onDownload}
          />
          <LogoGuidelinesCard logoUrl={logoUrl} />
        </div>
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
            <div className="grid gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-4">Facebook Preview</h4>
                <FacebookPreview
                  content={`${brandName}\n${tagline}`}
                  imageUrl={logoUrl}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4">LinkedIn Preview</h4>
                <LinkedinPreview
                  content={`${brandName}\n${tagline}`}
                  imageUrl={logoUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}