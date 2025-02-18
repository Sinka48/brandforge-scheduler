
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IndustrySelector } from "./IndustrySelector";

export function BusinessInfoSection({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Business Name (Optional)</FormLabel>
        <FormControl>
          <Input
            placeholder="Enter business name or leave empty for AI generation"
            {...form.register("businessName")}
          />
        </FormControl>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Industry (Optional)</FormLabel>
        <IndustrySelector
          selected={form.watch("industry")}
          onSelect={(industry) => {
            form.setValue("industry", industry);
          }}
        />
        <FormMessage />
      </FormItem>
    </div>
  );
}
