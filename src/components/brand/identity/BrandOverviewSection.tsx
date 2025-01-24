import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Sparkles, BookOpen, MessageCircle } from "lucide-react";

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
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">{brandName}</h3>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Business Information Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Industry Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Industry</h4>
                </div>
                <p className="text-sm pl-6">
                  {industry || "Not specified"}
                </p>
              </div>

              {/* Target Audience Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Target Audience</h4>
                </div>
                <p className="text-sm pl-6">
                  {targetAudience || "Not specified"}
                </p>
              </div>

              {/* Brand Personality Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Brand Personality</h4>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
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
                    <span className="text-sm text-muted-foreground">
                      No personality traits specified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Story & Bio Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Brand Story Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Brand Story</h4>
                </div>
                <p className="text-sm pl-6 text-muted-foreground">
                  {story || "AI will generate an engaging brand story"}
                </p>
              </div>

              {/* Social Media Bio Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <h4 className="font-medium text-foreground">Social Media Bio</h4>
                </div>
                <p className="text-sm pl-6 text-muted-foreground">
                  {socialBio || "AI will generate a compelling social media bio"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}