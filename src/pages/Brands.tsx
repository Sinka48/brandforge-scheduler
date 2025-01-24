import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { BrandManager } from "@/components/brand/BrandManager";
import { Wand2, Library } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BrandsPageProps {
  session: Session;
}

export default function BrandsPage({ session }: BrandsPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const defaultTab = searchParams.get("tab") || "generator";
  const selectedBrandId = searchParams.get("selectedBrand");

  useEffect(() => {
    // Show success toast if redirected from brand creation
    const justCreated = searchParams.get("brandCreated");
    if (justCreated === "true") {
      toast({
        title: "Brand Created Successfully",
        description: "Your brand has been created. You can view and manage it in the Brand Library.",
      });
      // Remove the query parameter
      navigate("/brands?tab=library", { replace: true });
    }
  }, [searchParams, navigate, toast]);

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
          <p className="text-muted-foreground">
            Generate and manage your brand identities
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Brand Generator
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Brand Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Create New Brand</h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the questionnaire to generate a new brand identity
                </p>
              </div>
              <BrandQuestionnaireForm />
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Your Brands</h2>
                <p className="text-sm text-muted-foreground">
                  View and manage your generated brand identities
                </p>
              </div>
              <BrandManager selectedBrandId={selectedBrandId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}