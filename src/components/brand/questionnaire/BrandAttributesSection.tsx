
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalitySelector } from "./PersonalitySelector";
import { TargetAudienceSelector } from "./TargetAudienceSelector";
import { ColorSelector } from "./ColorSelector";

interface BrandAttributesSectionProps {
  form: any;
}

export function BrandAttributesSection({ form }: BrandAttributesSectionProps) {
  const handlePersonalityChange = (traits: string[]) => {
    form.setValue("brandPersonality", traits);
  };

  const handleColorChange = (colors: string[]) => {
    if (colors.length <= 5) {
      form.setValue("colorPreferences", colors);
    }
  };

  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Brand Personality (Optional)</FormLabel>
        <PersonalitySelector
          selected={form.watch("brandPersonality") || []}
          onSelect={handlePersonalityChange}
        />
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Target Audience (Optional)</FormLabel>
        <TargetAudienceSelector
          selected={form.watch("targetAudience")}
          onSelect={(audience) => {
            form.setValue("targetAudience", audience);
          }}
        />
        <FormMessage />
      </FormItem>

      <FormField
        control={form.control}
        name="colorPreferences"
        render={() => (
          <FormItem>
            <FormLabel>Color Preferences (Optional)</FormLabel>
            <ColorSelector
              selected={form.watch("colorPreferences") || []}
              onSelect={handleColorChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
