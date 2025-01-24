import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface BrandSocialPreviewProps {
  brand: Brand;
  onRegenerateAsset?: (assetType: string) => void;
}

export function BrandSocialPreview({ brand, onRegenerateAsset }: BrandSocialPreviewProps) {
  const socialAssets = brand.metadata.socialAssets || {};
  const platforms = [
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: Twitter,
      profileSize: '400x400px',
      coverSize: '1500x500px',
      supportsCover: true,
      profileRecommendation: 'Square image, max 2MB'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook,
      profileSize: '170x170px',
      coverSize: '820x312px',
      supportsCover: true,
      profileRecommendation: 'Will be cropped to circle'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram,
      profileSize: '320x320px',
      supportsCover: false,
      profileRecommendation: 'Square image recommended'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin,
      profileSize: '400x400px',
      coverSize: '1584x396px',
      supportsCover: true,
      profileRecommendation: 'Professional headshot recommended'
    },
  ];
  
  const handleDownload = (url: string, platform: string, type: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand.metadata.name || 'brand'}-${platform}-${type}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Profile Image</h3>
                    <p className="text-sm text-muted-foreground">
                      Recommended size: {platform.profileSize}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {platform.profileRecommendation}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRegenerateAsset?.(`${platform.id}_profile`)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(
                        socialAssets[`${platform.id}ProfileImage`] || socialAssets.profileImage || '',
                        platform.name,
                        'profile'
                      )}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <img
                  src={socialAssets[`${platform.id}ProfileImage`] || socialAssets.profileImage}
                  alt={`${platform.name} Profile`}
                  className="h-32 w-32 rounded-full object-cover border shadow-sm"
                />
              </div>

              {platform.supportsCover && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Cover Image</h3>
                      <p className="text-sm text-muted-foreground">
                        Recommended size: {platform.coverSize}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRegenerateAsset?.(`${platform.id}_cover`)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(
                          socialAssets[`${platform.id}CoverImage`] || socialAssets.coverImage || '',
                          platform.name,
                          'cover'
                        )}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <img
                    src={socialAssets[`${platform.id}CoverImage`] || socialAssets.coverImage}
                    alt={`${platform.name} Cover`}
                    className="w-full rounded-lg object-cover border shadow-sm"
                    style={{ height: '200px' }}
                  />
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}