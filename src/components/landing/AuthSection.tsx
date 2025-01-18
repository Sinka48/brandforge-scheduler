import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Facebook } from "lucide-react";
import { useState } from "react";

export function AuthSection() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    // Dummy function - will be replaced with actual implementation
    console.log(`Logging in with ${provider}`);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="w-[40%] p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('email')}
                disabled={isLoading}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('meta')}
                disabled={isLoading}
                className="w-full"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Meta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}