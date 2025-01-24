import { Layout } from "@/components/layout/Layout";
import { Session } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface BrandPageProps {
  session: Session;
}

export default function BrandPage({ session }: BrandPageProps) {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBrand() {
      try {
        const { data, error } = await supabase
          .from("brand_assets")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setBrand(data);
      } catch (error) {
        console.error("Error fetching brand:", error);
        toast({
          title: "Error",
          description: "Failed to load brand details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBrand();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <Layout session={session}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading brand details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!brand) {
    return (
      <Layout session={session}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Brand not found</h2>
          <p className="text-muted-foreground">
            The brand you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/brands")}>
            Back to Brands
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {brand.metadata.name || "Untitled Brand"}
            </h1>
            <p className="text-muted-foreground">
              View and manage your brand details
            </p>
          </div>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/brand/${id}/identity`)}
            >
              Customize Brand Identity
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {brand.metadata.socialBio && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Brand Description</h2>
              <p className="text-muted-foreground">{brand.metadata.socialBio}</p>
            </div>
          )}

          {brand.url && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Brand Logo</h2>
              <img
                src={brand.url}
                alt="Brand logo"
                className="max-w-xs rounded-lg border"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}