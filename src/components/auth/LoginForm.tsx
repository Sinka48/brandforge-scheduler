import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        console.error("Auth error:", error);
        
        if (error instanceof AuthApiError) {
          switch (error.status) {
            case 400:
              if (error.message.includes("Email not confirmed")) {
                toast({
                  title: "Email not verified",
                  description: "Please check your email and verify your account before logging in.",
                  variant: "destructive",
                });
              } else {
                toast({
                  title: "Invalid credentials",
                  description: "The email or password you entered is incorrect. Please try again.",
                  variant: "destructive",
                });
              }
              break;
            case 429:
              toast({
                title: "Too many attempts",
                description: "Please wait a moment before trying again.",
                variant: "destructive",
              });
              break;
            default:
              toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
              });
          }
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      // Successful login
      const { data: session } = await supabase.auth.getSession();
      if (session) {
        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...field} 
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}