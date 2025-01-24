import { FormField } from "@/components/ui/form";
import { MessageSquare, Palette, Users } from "lucide-react";
import { IndustrySelector } from "./IndustrySelector";
import { PersonalitySelector } from "./PersonalitySelector";
import { TargetAudienceSelector } from "./TargetAudienceSelector";
import { ColorSelector } from "./ColorSelector";
import { UseFormReturn } from "react-hook-form";

interface BrandAttributesSectionProps {
  form: UseFormReturn<any>;
}

export function BrandAttributesSection({ form }: BrandAttributesSectionProps) {
  const selectedPersonality = form.watch("brandPersonality") || [];
  const selectedIndustry = form.watch("industry");
  const selectedTargetAudience = form.watch("targetAudience");
  const selectedColors = form.watch("colorPreferences") || [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="text-lg font-medium">Industry</h3>
        </div>
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <IndustrySelector
              selected={field.value}
              onSelect={(industry) => field.onChange(industry)}
            />
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-medium">Target Audience</h3>
        </div>
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <TargetAudienceSelector
              selected={field.value}
              onSelect={(audience) => field.onChange(audience)}
            />
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h3 className="text-lg font-medium">Brand Personality</h3>
        </div>
        <FormField
          control={form.control}
          name="brandPersonality"
          render={({ field }) => (
            <PersonalitySelector
              selected={field.value}
              onSelect={(traits) => field.onChange(traits)}
            />
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <h3 className="text-lg font-medium">Color Preferences</h3>
        </div>
        <FormField
          control={form.control}
          name="colorPreferences"
          render={({ field }) => (
            <ColorSelector
              selected={field.value}
              onSelect={(colors) => field.onChange(colors)}
            />
          )}
        />
      </div>
    </>
  );
}