import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BusinessInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BusinessInfoSection({ form }: BusinessInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h3 className="text-lg font-medium">Business Information</h3>
      </div>
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <Input
            placeholder="Enter your business name"
            {...field}
          />
        )}
      />
      <FormField
        control={form.control}
        name="socialBio"
        render={({ field }) => (
          <Textarea
            placeholder="Enter a brief social media bio (max 160 characters)"
            {...field}
            className="resize-none"
            maxLength={160}
          />
        )}
      />
      <FormField
        control={form.control}
        name="brandStory"
        render={({ field }) => (
          <Textarea
            placeholder="Share your brand's story (max 500 characters)"
            {...field}
            className="resize-none"
            maxLength={500}
          />
        )}
      />
    </div>
  );
}