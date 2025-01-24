import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      assets: [
        {
          type: 'profile',
          size: '400x400px',
          recommendation: 'Square image, max 2MB',
          imageUrl: socialAssets.profileImage,
          regenerateType: 'twitter_profile'
        },
        {
          type: 'cover',
          size: '1500x500px',
          recommendation: 'Recommended size for header image',
          imageUrl: socialAssets.coverImage,
          regenerateType: 'twitter_cover'
        }
      ]
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook,
      assets: [
        {
          type: 'profile',
          size: '170x170px',
          recommendation: 'Will be cropped to circle',
          imageUrl: socialAssets.profileImage,
          regenerateType: 'facebook_profile'
        },
        {
          type: 'cover',
          size: '820x312px',
          recommendation: 'Cover photo for your page',
          imageUrl: socialAssets.coverImage,
          regenerateType: 'facebook_cover'
        }
      ]
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram,
      assets: [
        {
          type: 'profile',
          size: '320x320px',
          recommendation: 'Square image recommended',
          imageUrl: socialAssets.profileImage,
          regenerateType: 'instagram_profile'
        }
      ]
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin,
      assets: [
        {
          type: 'profile',
          size: '400x400px',
          recommendation: 'Professional headshot recommended',
          imageUrl: socialAssets.profileImage,
          regenerateType: 'linkedin_profile'
        },
        {
          type: 'cover',
          size: '1584x396px',
          recommendation: 'Company page banner image',
          imageUrl: socialAssets.coverImage,
          regenerateType: 'linkedin_cover'
        }
      ]
    }
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
    <div className="space-y-6">
      {platforms.map((platform) => (
        <Card key={platform.id} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <platform.icon className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{platform.name}</h3>
          </div>
          <div className="space-y-6">
            {platform.assets.map((asset) => (
              <div key={asset.type} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">{asset.type} Image</h4>
                    <p className="text-sm text-muted-foreground">
                      {asset.size} - {asset.recommendation}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRegenerateAsset?.(asset.regenerateType)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(
                        asset.imageUrl || '',
                        platform.name,
                        asset.type
                      )}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                {asset.imageUrl && (
                  <img
                    src={asset.imageUrl}
                    alt={`${platform.name} ${asset.type}`}
                    className={`border shadow-sm rounded-lg ${
                      asset.type === 'profile' 
                        ? 'h-32 w-32 object-cover rounded-full' 
                        : 'w-full h-[200px] object-cover'
                    }`}
                  />
                )}
                {asset !== platform.assets[platform.assets.length - 1] && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}