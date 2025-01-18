import { Layout } from "@/components/layout/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

const settingsFormSchema = z.object({
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
  defaultPlatform: z.string({
    required_error: "Please select a default platform.",
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsPageProps {
  session: Session;
}

export default function SettingsPage({ session }: SettingsPageProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      timezone: "",
      defaultPlatform: "",
    },
  });

  useEffect(() => {
    const loadUserSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        form.reset({
          displayName: user.user_metadata.displayName || "",
          email: user.email || "",
          timezone: user.user_metadata.timezone || "UTC",
          defaultPlatform: user.user_metadata.defaultPlatform || "twitter",
        });
      }
      setIsLoading(false);
    };

    loadUserSettings();
  }, [form]);

  async function onSubmit(data: SettingsFormValues) {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          displayName: data.displayName,
          timezone: data.timezone,
          defaultPlatform: data.defaultPlatform,
        },
      });

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <Layout session={session}>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Account Settings</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Update your account information and preferences.
              </p>
              <Separator className="my-6" />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your display name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Your email address for notifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your preferred timezone for scheduling posts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultPlatform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select default platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Your default platform for new posts.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save changes</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
