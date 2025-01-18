import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { BrandManager } from "@/components/brand/BrandManager";
import { Wand2, Library } from "lucide-react";

export default function BrandPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Generator</h1>
          <p className="text-muted-foreground">
            Create and manage your brand identity
          </p>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate Brand
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Saved Brands
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <BrandQuestionnaireForm />
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <BrandManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}