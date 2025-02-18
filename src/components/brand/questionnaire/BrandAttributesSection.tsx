
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
          onSelect={(personality) => {
            const current = form.watch("brandPersonality") || [];
            if (current.includes(personality)) {
              form.setValue(
                "brandPersonality",
                current.filter((p: string) => p !== personality)
              );
            } else {
              form.setValue("brandPersonality", [...current, personality]);
            }
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
              onSelect={(color) => {
                const current = form.watch("colorPreferences") || [];
                if (current.includes(color)) {
                  form.setValue(
                    "colorPreferences",
                    current.filter((c: string) => c !== color)
                  );
                } else if (current.length < 5) {
                  form.setValue("colorPreferences", [...current, color]);
                }
              }}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
