import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Wand2, Loader2, Building2, Users, Palette, MessageSquare } from "lucide-react"
import { IndustrySelector } from "./questionnaire/IndustrySelector"
import { PersonalitySelector } from "./questionnaire/PersonalitySelector"
import { TargetAudienceSelector } from "./questionnaire/TargetAudienceSelector"
import { ColorSelector } from "./questionnaire/ColorSelector"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  businessName: z.string().optional(),
  industry: z.string().optional(),
  brandPersonality: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  socialBio: z.string().max(160, "Social bio must be less than 160 characters").optional(),
  brandStory: z.string().max(500, "Brand story must be less than 500 characters").optional(),
  colorPreferences: z.array(z.string()).optional(),
})

export function BrandQuestionnaireForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      brandPersonality: [],
      targetAudience: "",
      socialBio: "",
      brandStory: "",
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

      console.log("Saving questionnaire with values:", values);

      const defaultBusinessName = "AI Generated Brand";
      const businessName = values.businessName?.trim() || defaultBusinessName;
      const description = values.businessName ? `Brand for ${values.businessName}` : defaultBusinessName;

      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .insert({
          user_id: user.id,
          business_name: businessName,
          industry: values.industry || "General",
          description: description,
          brand_personality: values.brandPersonality || [],
          target_audience: values.targetAudience ? { primary: values.targetAudience } : {},
          color_preferences: values.colorPreferences || [],
          is_ai_generated: !values.businessName && !values.industry && (!values.brandPersonality || values.brandPersonality.length === 0),
          ai_generated_parameters: {
            socialBio: values.socialBio,
            brandStory: values.brandStory,
          }
        })
        .select()
        .single();

      if (questionnaireError) {
        console.error("Error saving questionnaire:", questionnaireError);
        throw questionnaireError;
      }

      if (!questionnaire) {
        throw new Error("Failed to create questionnaire");
      }

      console.log("Sending questionnaire to edge function:", questionnaire);

      const { data: brandData, error: brandError } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { 
            questionnaire: {
              id: questionnaire.id,
              user_id: questionnaire.user_id,
              business_name: questionnaire.business_name,
              industry: questionnaire.industry,
              brand_personality: questionnaire.brand_personality,
              target_audience: questionnaire.target_audience,
              is_ai_generated: questionnaire.is_ai_generated,
              ai_generated_parameters: questionnaire.ai_generated_parameters
            }
          }
        }
      );

      if (brandError) {
        console.error("Error generating brand:", brandError);
        throw brandError;
      }

      console.log("Received brand data:", brandData);

      // Save the brand asset
      const { error: assetError } = await supabase
        .from("brand_assets")
        .insert({
          user_id: user.id,
          questionnaire_id: questionnaire.id,
          asset_type: 'brand_identity',
          url: brandData.logoUrl,
          metadata: brandData.metadata,
          asset_category: 'brand'
        });

      if (assetError) {
        console.error("Error saving brand asset:", assetError);
        throw assetError;
      }

      // Navigate to brand list page
      navigate("/brands");
      
      toast({
        title: "Brand Generated!",
        description: "Your brand identity has been created. You can now customize it.",
      });

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

  const selectedPersonality = form.watch("brandPersonality") || []
  const selectedIndustry = form.watch("industry")
  const selectedTargetAudience = form.watch("targetAudience")
  const selectedColors = form.watch("colorPreferences") || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <h3 className="text-lg font-medium">Business Information</h3>
              </div>
              <div>
                <Input
                  placeholder="Enter your business name"
                  {...form.register("businessName")}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Enter a brief social media bio (max 160 characters)"
                  {...form.register("socialBio")}
                  className="resize-none"
                  maxLength={160}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Share your brand's story (max 500 characters)"
                  {...form.register("brandStory")}
                  className="resize-none"
                  maxLength={500}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-lg font-medium">Industry</h3>
              </div>
              <div>
                <IndustrySelector
                  selected={selectedIndustry}
                  onSelect={(industry) => form.setValue("industry", industry)}
                />
              </div>
              {selectedIndustry && (
                <div className="mt-2">
                  <Badge variant="secondary">{selectedIndustry}</Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h3 className="text-lg font-medium">Target Audience</h3>
              </div>
              <div>
                <TargetAudienceSelector
                  selected={selectedTargetAudience}
                  onSelect={(audience) => form.setValue("targetAudience", audience)}
                />
              </div>
              {selectedTargetAudience && (
                <div className="mt-2">
                  <Badge variant="secondary">{selectedTargetAudience}</Badge>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <h3 className="text-lg font-medium">Brand Personality</h3>
              </div>
              <div>
                <PersonalitySelector
                  selected={selectedPersonality}
                  onSelect={(traits) => form.setValue("brandPersonality", traits)}
                />
              </div>
              {selectedPersonality.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPersonality.map((trait, index) => (
                    <Badge key={index} variant="secondary">
                      {trait}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <h3 className="text-lg font-medium">Color Preferences</h3>
              </div>
              <div>
                <ColorSelector
                  selected={selectedColors}
                  onSelect={(colors) => form.setValue("colorPreferences", colors)}
                />
              </div>
              {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedColors.map((color, index) => (
                    <Badge key={index} variant="secondary">
                      {color}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

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
  )
}