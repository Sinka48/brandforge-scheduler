import { Badge } from "@/components/ui/badge";

interface BrandOverviewSectionProps {
  brandName: string;
  industry?: string;
  targetAudience?: string;
  brandPersonality?: string[] | string;
  story?: string;
  socialBio?: string;
}

export function BrandOverviewSection({
  brandName,
  industry,
  targetAudience,
  brandPersonality,
  story,
  socialBio,
}: BrandOverviewSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{brandName}</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Business & Brand Information */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Industry & Target Market</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Industry</span>
                <span className="font-medium">{industry || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Audience</span>
                <span className="font-medium">{targetAudience || "Not specified"}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Brand Personality</h4>
            <div className="flex flex-wrap gap-2">
              {brandPersonality ? (
                Array.isArray(brandPersonality) ? (
                  brandPersonality.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary">{brandPersonality}</Badge>
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
              {story || "AI will generate an engaging brand story"}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Social Media Bio</h4>
            <p className="text-muted-foreground">
              {socialBio || "AI will generate a compelling social media bio"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}