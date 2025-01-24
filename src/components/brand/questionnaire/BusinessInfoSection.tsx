import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building2, Wand2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessInfoSectionProps {
  form: UseFormReturn<any>;
}

export function BusinessInfoSection({ form }: BusinessInfoSectionProps) {
  const { toast } = useToast();

  const generateBusinessName = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { generateNameOnly: true }
        }
      );

      if (error) throw error;

      if (data?.metadata?.name) {
        form.setValue("businessName", data.metadata.name);
        toast({
          title: "Business Name Generated",
          description: "A new business name has been generated for you.",
        });
      }
    } catch (error) {
      console.error("Error generating business name:", error);
      toast({
        title: "Error",
        description: "Failed to generate business name. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h3 className="text-lg font-medium">Business Name</h3>
      </div>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <div className="flex-1">
              <Input
                placeholder="Enter your business name (optional)"
                {...field}
              />
            </div>
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateBusinessName}
          title="Generate business name"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}