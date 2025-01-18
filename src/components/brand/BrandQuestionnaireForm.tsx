import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

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
  targetAudience: z.object({
    ageRange: z.string(),
    location: z.string(),
    interests: z.string(),
  }),
  brandPersonality: z.array(z.string()).min(1, {
    message: "Select at least one personality trait.",
  }),
  colorPreferences: z.array(z.string()),
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
      targetAudience: {
        ageRange: "",
        location: "",
        interests: "",
      },
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

      const { error } = await supabase.from("brand_questionnaires").insert({
        user_id: user.id,
        business_name: values.businessName,
        industry: values.industry,
        description: values.description,
        target_audience: values.targetAudience,
        brand_personality: values.brandPersonality,
        color_preferences: values.colorPreferences,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: "Your brand questionnaire has been saved.",
      })

      // Navigate to the next step (we'll implement this later)
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

  const industries = [
    "Technology",
    "Healthcare",
    "Education",
    "Retail",
    "Finance",
    "Entertainment",
    "Food & Beverage",
    "Travel",
    "Real Estate",
    "Other",
  ]

  const personalityTraits = [
    "Professional",
    "Friendly",
    "Innovative",
    "Traditional",
    "Luxurious",
    "Playful",
    "Minimalist",
    "Bold",
    "Trustworthy",
    "Creative",
  ]

  const colorOptions = [
    "Blue",
    "Green",
    "Red",
    "Purple",
    "Yellow",
    "Orange",
    "Black",
    "White",
    "Gray",
    "Brown",
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormDescription>
                This is how your brand will be known to your customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the industry that best describes your business.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your business..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of what your business does and its mission.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Target Audience</h3>
          
          <FormField
            control={form.control}
            name="targetAudience.ageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 25-34" {...field} />
                </FormControl>
                <FormDescription>
                  What age group are you primarily targeting?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience.location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., United States, Global" {...field} />
                </FormControl>
                <FormDescription>
                  Where is your target audience located?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetAudience.interests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interests</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Technology, Fashion, Sports" {...field} />
                </FormControl>
                <FormDescription>
                  What are your target audience's main interests?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="brandPersonality"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Brand Personality</FormLabel>
                <FormDescription>
                  Select traits that best describe your brand's personality.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {personalityTraits.map((trait) => (
                  <FormField
                    key={trait}
                    control={form.control}
                    name="brandPersonality"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={trait}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(trait)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, trait])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== trait
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {trait}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorPreferences"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Color Preferences</FormLabel>
                <FormDescription>
                  Select colors you'd like to incorporate into your brand.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorOptions.map((color) => (
                  <FormField
                    key={color}
                    control={form.control}
                    name="colorPreferences"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={color}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(color)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, color])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== color
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {color}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  )
}