
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PersonalitySelector } from "./PersonalitySelector";
import { TargetAudienceSelector } from "./TargetAudienceSelector";
import { ColorSelector } from "./ColorSelector";

export function BrandAttributesSection({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Brand Personality (Optional)</FormLabel>
        <PersonalitySelector
          selected={form.watch("brandPersonality") || []}
          onSelect={(personalities: string[]) => {
            form.setValue("brandPersonality", personalities);
          }}
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
              onSelect={(colors: string[]) => {
                form.setValue("colorPreferences", colors);
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
