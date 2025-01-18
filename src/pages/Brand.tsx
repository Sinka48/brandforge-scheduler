import { Layout } from "@/components/layout/Layout";
import { BrandQuestionnaireForm } from "@/components/brand/BrandQuestionnaireForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface BrandPageProps {
  session: Session;
}

export default function BrandPage({ session }: BrandPageProps) {
  const navigate = useNavigate();

  return (
    <Layout session={session}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Generator</h1>
          <p className="text-muted-foreground">
            Create and manage your brand identity
          </p>
        </div>

        <div className="space-y-6">
          <BrandQuestionnaireForm />
        </div>
      </div>
    </Layout>
  );
}