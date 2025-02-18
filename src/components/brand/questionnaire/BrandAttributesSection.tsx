
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalitySelector } from "./PersonalitySelector";
import { TargetAudienceSelector } from "./TargetAudienceSelector";
import { ColorSelector } from "./ColorSelector";

interface BrandAttributesSectionProps {
  form: any;
}

export function BrandAttributesSection({ form }: BrandAttributesSectionProps) {
  const handlePersonalityChange = (personality: string) => {
    const current = form.watch("brandPersonality") || [];
    const updated = current.includes(personality)
      ? current.filter((p: string) => p !== personality)
      : [...current, personality];
    form.setValue("brandPersonality", updated);
  };

  const handleColorChange = (color: string) => {
    const current = form.watch("colorPreferences") || [];
    if (current.includes(color)) {
      form.setValue(
        "colorPreferences",
        current.filter((c: string) => c !== color)
      );
    } else if (current.length < 5) {
      form.setValue("colorPreferences", [...current, color]);
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
