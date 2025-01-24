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

      // Save questionnaire with optional fields
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .insert({
          user_id: user.id,
          business_name: values.businessName || "My Brand",
          industry: values.industry || "General",
          description: "", 
          brand_personality: values.brandPersonality || [],
          color_preferences: [],
          target_audience: {},
        })
        .select()
        .single()

      if (questionnaireError) throw questionnaireError

      // Generate brand identity
      const { data: brandData, error: brandError } = await supabase.functions.invoke(
        "generate-brand-identity",
        {
          body: { 
            questionnaire,
            version: 1
          },
        }
      )

      if (brandError) throw brandError

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
              <Input
                placeholder="Enter your business name"
                {...form.register("businessName")}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Industry (Optional)</h3>
              <IndustrySelector
                selected={form.watch("industry")}
                onSelect={(industry) => form.setValue("industry", industry)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Brand Personality (Optional)</h3>
              <PersonalitySelector
                selected={form.watch("brandPersonality")}
                onSelect={(traits) => form.setValue("brandPersonality", traits)}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isGenerating}>
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