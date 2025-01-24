import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2, Loader2 } from "lucide-react"
import { IndustrySelector } from "./questionnaire/IndustrySelector"
import { PersonalitySelector } from "./questionnaire/PersonalitySelector"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
  businessName: z.string().optional(),
  industry: z.string().optional(),
  brandPersonality: z.array(z.string()).optional(),
})

export function BrandQuestionnaireForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      brandPersonality: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsGenerating(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your brand questionnaire.",
          variant: "destructive",
        })
        return
      }

      console.log("Saving questionnaire with values:", values)

      // Save questionnaire with optional fields
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .insert({
          user_id: user.id,
          business_name: values.businessName || null,
          industry: values.industry || null,
          description: values.businessName ? `Brand for ${values.businessName}` : "AI Generated Brand",
          brand_personality: values.brandPersonality || [],
          color_preferences: [],
          target_audience: {},
          is_ai_generated: !values.businessName && !values.industry && (!values.brandPersonality || values.brandPersonality.length === 0),
          ai_generated_parameters: {}
        })
        .select()
        .single()

      if (questionnaireError) {
        console.error("Error saving questionnaire:", questionnaireError)
        throw questionnaireError
      }

      if (!questionnaire) {
        throw new Error("Failed to create questionnaire")
      }

      console.log("Sending questionnaire to edge function:", questionnaire)

      // Generate brand identity with properly structured data
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
              is_ai_generated: questionnaire.is_ai_generated
            }
          }
        }
      )

      if (brandError) {
        console.error("Error generating brand:", brandError)
        throw brandError
      }

      console.log("Received brand data:", brandData)

      // If AI generated parameters were returned, update the questionnaire
      if (brandData.ai_generated_parameters) {
        const { error: updateError } = await supabase
          .from("brand_questionnaires")
          .update({ ai_generated_parameters: brandData.ai_generated_parameters })
          .eq("id", questionnaire.id)

        if (updateError) {
          console.error("Error updating AI parameters:", updateError)
        }
      }

      // Navigate to brand identity page for customization
      navigate("/brand-identity")
      
      toast({
        title: "Brand Generated!",
        description: "Your brand identity has been created. You can now customize it.",
      })

    } catch (error) {
      console.error("Error generating brand:", error)
      toast({
        title: "Error",
        description: "Failed to generate your brand. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Business Information (Optional)</h3>
              <div>
                <Input
                  placeholder="Enter your business name"
                  {...form.register("businessName")}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Industry (Optional)</h3>
              <div>
                <IndustrySelector
                  selected={form.watch("industry")}
                  onSelect={(industry) => form.setValue("industry", industry)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Brand Personality (Optional)</h3>
              <div>
                <PersonalitySelector
                  selected={form.watch("brandPersonality") || []}
                  onSelect={(traits) => form.setValue("brandPersonality", traits)}
                />
              </div>
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