import { Brand } from "@/types/brand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FacebookPreview } from "@/components/calendar/post-dialog/platform-previews/FacebookPreview";
import { LinkedinPreview } from "@/components/calendar/post-dialog/platform-previews/LinkedinPreview";

interface BrandSocialPreviewProps {
  brand: Brand;
  onRegenerateAsset?: (assetType: string) => void;
}

export function BrandSocialPreview({ brand, onRegenerateAsset }: BrandSocialPreviewProps) {
  const socialAssets = brand.metadata.socialAssets || {};
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Profile Image</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerateAsset?.('profile')}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
        <img
          src={socialAssets.profileImage}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover border"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cover Image</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerateAsset?.('cover')}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
        <img
          src={socialAssets.coverImage}
          alt="Cover"
          className="w-full h-48 rounded-lg object-cover border"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Platform Previews</h3>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Facebook Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <FacebookPreview
                content={brand.metadata.socialBio || ""}
                imageUrl={socialAssets.profileImage}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">LinkedIn Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkedinPreview
                content={brand.metadata.socialBio || ""}
                imageUrl={socialAssets.profileImage}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}