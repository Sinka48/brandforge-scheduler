import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { IndustrySelector } from "./questionnaire/IndustrySelector"
import { PersonalitySelector } from "./questionnaire/PersonalitySelector"
import { ColorSelector } from "./questionnaire/ColorSelector"

const formSchema = z.object({
  businessName: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
  industry: z.string({
    required_error: "Please select an industry.",
  }),
  description: z.string().min(10, {
    message: "Business description must be at least 10 characters.",
  }),
  brandPersonality: z.array(z.string()).min(1, {
    message: "Select at least one personality trait.",
  }),
  colorPreferences: z.array(z.string()).min(1, {
    message: "Select at least one color.",
  }),
})

export function BrandQuestionnaireForm() {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      description: "",
      brandPersonality: [],
      colorPreferences: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
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

      const { data, error } = await supabase.from("brand_questionnaires").insert({
        user_id: user.id,
        business_name: values.businessName,
        industry: values.industry,
        description: values.description,
        brand_personality: values.brandPersonality,
        color_preferences: values.colorPreferences,
        target_audience: {}, // Simplified, removed detailed targeting
      })
      .select()
      .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your brand questionnaire has been saved. Generating your brand identity...",
      })

      // Navigate to brand identity page after saving questionnaire
      navigate("/brand/identity")
    } catch (error) {
      console.error("Error saving questionnaire:", error)
      toast({
        title: "Error",
        description: "Failed to save your questionnaire. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Input
            placeholder="Enter your business name"
            {...form.register("businessName")}
          />
          {form.formState.errors.businessName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.businessName.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Industry</h3>
          <IndustrySelector
            selected={form.watch("industry")}
            onSelect={(industry) => form.setValue("industry", industry)}
          />
          {form.formState.errors.industry && (
            <p className="text-sm text-red-500">
              {form.formState.errors.industry.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Brief Description</h3>
          <Input
            placeholder="Briefly describe your business..."
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Brand Personality</h3>
          <PersonalitySelector
            selected={form.watch("brandPersonality")}
            onSelect={(traits) => form.setValue("brandPersonality", traits)}
          />
          {form.formState.errors.brandPersonality && (
            <p className="text-sm text-red-500">
              {form.formState.errors.brandPersonality.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Color Preferences</h3>
          <ColorSelector
            selected={form.watch("colorPreferences")}
            onSelect={(colors) => form.setValue("colorPreferences", colors)}
          />
          {form.formState.errors.colorPreferences && (
            <p className="text-sm text-red-500">
              {form.formState.errors.colorPreferences.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Brand
          </Button>
        </div>
      </form>
    </Form>
  )
}
