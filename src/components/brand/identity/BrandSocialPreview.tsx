import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { RefreshCw, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandSocialPreviewProps {
  brand: Brand;
  onRegenerateAsset?: (assetType: string) => void;
}

export function BrandSocialPreview({ brand, onRegenerateAsset }: BrandSocialPreviewProps) {
  const socialAssets = brand.metadata.socialAssets || {};
  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  ];
  
  return (
    <Tabs defaultValue="twitter" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {platforms.map((platform) => (
          <TabsTrigger 
            key={platform.id}
            value={platform.id} 
            className="flex items-center gap-2"
          >
            <platform.icon className="h-4 w-4" />
            {platform.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {platforms.map((platform) => (
        <TabsContent key={platform.id} value={platform.id} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile Image</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerateAsset?.(`${platform.id}_profile`)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <img
              src={socialAssets[`${platform.id}ProfileImage`] || socialAssets.profileImage}
              alt={`${platform.name} Profile`}
              className="h-32 w-32 rounded-full object-cover border"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cover Image</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerateAsset?.(`${platform.id}_cover`)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
            <img
              src={socialAssets[`${platform.id}CoverImage`] || socialAssets.coverImage}
              alt={`${platform.name} Cover`}
              className="w-full h-48 rounded-lg object-cover border"
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}