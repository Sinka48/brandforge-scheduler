import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2, Building2, Palette, Users2 } from "lucide-react"
import { IndustrySelector } from "./questionnaire/IndustrySelector"
import { PersonalitySelector } from "./questionnaire/PersonalitySelector"
import { ColorSelector } from "./questionnaire/ColorSelector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
        target_audience: {},
      })
      .select()
      .single()

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your brand questionnaire has been saved. Generating your brand identity...",
      })

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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter your business name"
                {...form.register("businessName")}
              />
              {form.formState.errors.businessName && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <IndustrySelector
                selected={form.watch("industry")}
                onSelect={(industry) => form.setValue("industry", industry)}
              />
              {form.formState.errors.industry && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.industry.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Briefly describe your business..."
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5" />
              Brand Personality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalitySelector
              selected={form.watch("brandPersonality")}
              onSelect={(traits) => form.setValue("brandPersonality", traits)}
            />
            {form.formState.errors.brandPersonality && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.brandPersonality.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ColorSelector
              selected={form.watch("colorPreferences")}
              onSelect={(colors) => form.setValue("colorPreferences", colors)}
            />
            {form.formState.errors.colorPreferences && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.colorPreferences.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Brand
          </Button>
        </div>
      </form>
    </Form>
  )
}