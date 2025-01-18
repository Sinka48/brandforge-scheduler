import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Palette, Type, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type BrandQuestionnaire = Tables<"brand_questionnaires">;

export default function BrandIdentityPage() {
  const [questionnaire, setQuestionnaire] = useState<BrandQuestionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestionnaire();
  }, []);

  const fetchQuestionnaire = async () => {
    try {
      const { data, error } = await supabase
        .from("brand_questionnaires")
        .select("*")
        .single();

      if (error) throw error;
      setQuestionnaire(data);
    } catch (error) {
      console.error("Error fetching questionnaire:", error);
      toast({
        title: "Error",
        description: "Failed to load brand questionnaire data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBrandIdentity = async () => {
    setGenerating(true);
    try {
      // TODO: Implement AI generation logic
      toast({
        title: "Coming Soon",
        description: "Brand identity generation will be available soon!",
      });
    } catch (error) {
      console.error("Error generating brand identity:", error);
      toast({
        title: "Error",
        description: "Failed to generate brand identity",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!questionnaire) {
    return (
      <Layout>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Brand Identity</h1>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Please complete the brand questionnaire first to generate your brand identity.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Identity</h1>
            <p className="text-muted-foreground">
              Generate and manage your brand identity assets
            </p>
          </div>
          <Button
            onClick={generateBrandIdentity}
            disabled={generating}
          >
            {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Brand Identity
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your brand color palette will appear here after generation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your brand typography recommendations will appear here after generation.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo Concepts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your logo concepts will appear here after generation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}