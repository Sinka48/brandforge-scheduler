import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BusinessInfoSection } from "./questionnaire/BusinessInfoSection"
import { BrandAttributesSection } from "./questionnaire/BrandAttributesSection"

const formSchema = z.object({
  industry: z.string().optional(),
  brandPersonality: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  colorPreferences: z.array(z.string()).max(5, "Maximum 5 colors allowed").optional(),
})

export function BrandQuestionnaireForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      brandPersonality: [],
      targetAudience: "",
      colorPreferences: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your brand questionnaire.",
          variant: "destructive",
        });
        return;
      }

      // All fields are optional now, AI will generate content
      const isAiGenerated = true;

      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .insert({
          user_id: user.id,
          business_name: "AI Generated Brand",
          industry: values.industry || "General",
          description: "AI Generated Brand",
          brand_personality: values.brandPersonality || [],
          target_audience: values.targetAudience ? { primary: values.targetAudience } : {},
          color_preferences: values.colorPreferences || [],
          is_ai_generated: isAiGenerated,
        })
        .select()
        .single();

      if (questionnaireError) throw questionnaireError;
      if (!questionnaire) throw new Error("Failed to create questionnaire");

      const { data: brandData, error: brandError } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { questionnaire }
        }
      );

      if (brandError) throw brandError;

      const { data: brandAsset, error: assetError } = await supabase
        .from("brand_assets")
        .insert({
          user_id: user.id,
          questionnaire_id: questionnaire.id,
          asset_type: 'brand_identity',
          url: brandData.logoUrl,
          metadata: brandData.metadata,
          asset_category: 'brand'
        })
        .select()
        .single();

      if (assetError) throw assetError;

      toast({
        title: "AI Brand Generated!",
        description: "Your AI-powered brand identity has been created. View it in the Brand Library.",
      });

      // Navigate to the brand preview with the newly created brand selected
      navigate(`/brands?tab=library&selectedBrand=${brandAsset.id}`);
      
    } catch (error) {
      console.error("Error generating brand:", error);
      toast({
        title: "Error",
        description: "Failed to generate your brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <BusinessInfoSection form={form} />
            <BrandAttributesSection form={form} />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Brand...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Brand
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}