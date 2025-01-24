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
import { ColorSelector } from "./questionnaire/ColorSelector"
import { useState } from "react"

const formSchema = z.object({
  businessName: z.string().optional(),
  industry: z.string().optional(),
  brandPersonality: z.array(z.string()).optional().default([]),
  colorPreferences: z.array(z.string()).optional().default([]),
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
      colorPreferences: [],
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

      // Save questionnaire
      const { data: questionnaire, error: questionnaireError } = await supabase
        .from("brand_questionnaires")
        .insert({
          user_id: user.id,
          business_name: values.businessName || "",
          industry: values.industry || "",
          description: "", // Empty string as description is no longer used
          brand_personality: values.brandPersonality || [],
          color_preferences: values.colorPreferences || [],
          target_audience: {}, // Simplified, removed detailed targeting
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

      toast({
        title: "Success!",
        description: "Your brand identity has been generated successfully.",
      })

      // Navigate to brand identity page after generation
      navigate("/brand/identity")
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Input
            placeholder="Enter your business name (optional)"
            {...form.register("businessName")}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Industry</h3>
          <IndustrySelector
            selected={form.watch("industry")}
            onSelect={(industry) => form.setValue("industry", industry)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Brand Personality</h3>
          <PersonalitySelector
            selected={form.watch("brandPersonality")}
            onSelect={(traits) => form.setValue("brandPersonality", traits)}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Color Preferences</h3>
          <ColorSelector
            selected={form.watch("colorPreferences")}
            onSelect={(colors) => form.setValue("colorPreferences", colors)}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
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
  )
}