import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
        name="industry"
        render={({ field }) => (
          <Input
            placeholder="Enter your industry (optional)"
            {...field}
          />
        )}
      />
    </div>
  );
}