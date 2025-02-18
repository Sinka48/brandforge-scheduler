
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { IndustrySelector } from "./IndustrySelector";

interface BusinessInfoSectionProps {
  form: any;
}

export function BusinessInfoSection({ form }: BusinessInfoSectionProps) {
  const handleGenerateName = () => {
    // Just update the form value with an empty string to trigger AI generation
    form.setValue("businessName", "");
  };

  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Business Name (Optional)</FormLabel>
        <div className="flex gap-2">
          <FormControl>
            <Input
              placeholder="Enter business name or leave empty for AI generation"
              {...form.register("businessName")}
            />
          </FormControl>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGenerateName}
            className="shrink-0"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Name
          </Button>
        </div>
        <FormMessage />
      </FormItem>

      <FormItem>
        <FormLabel>Industry (Optional)</FormLabel>
        <IndustrySelector
          selected={form.watch("industry")}
          onSelect={(industry) => {
            form.setValue("industry", industry, { shouldDirty: true });
          }}
        />
        <FormMessage />
      </FormItem>
    </div>
  );
}
