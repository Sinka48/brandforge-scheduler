
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { BrandReviewSection } from "./identity/BrandReviewSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Brand } from "@/types/brand";
import { BrandList } from "./BrandList";
import { useBrandFetching } from "@/hooks/useBrandFetching";
import { useNavigate } from "react-router-dom";

interface BrandManagerProps {
  selectedBrandId?: string;
}

export function BrandManager({ selectedBrandId }: BrandManagerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { brands, loading, fetchBrands } = useBrandFetching();

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    fetchBrands();
    // If selectedBrandId is provided, find and select that brand
    if (selectedBrandId && brands.length > 0) {
      const brand = brands.find(b => b.id === selectedBrandId);
      if (brand) {
        setSelectedBrand(brand);
      }
    }
  }, [selectedBrandId, brands]);

  const handleDeleteBrand = async (brandId: string) => {
    try {
      const { error } = await supabase
        .from("brand_assets")
        .delete()
        .eq("id", brandId);

      if (error) throw error;

      await fetchBrands();
      if (selectedBrand?.id === brandId) {
        setSelectedBrand(null);
      }
      toast({
        title: "Success",
        description: "Brand deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast({
        title: "Error",
        description: "Failed to delete brand",
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
  };

  const handleRegenerateAsset = async (assetType: string) => {
    if (!selectedBrand) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-brand-identity', {
        body: {
          brandId: selectedBrand.id,
          regenerateType: assetType,
        },
      });

      if (error) throw error;

      await fetchBrands();

      toast({
        title: "Success",
        description: `${assetType} image regenerated successfully`,
      });
    } catch (error) {
      console.error("Error regenerating asset:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {brands.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No brands found. Generate and save a brand identity first.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-transparent border-none">
            <CardContent>
              <BrandList
                brands={brands}
                selectedBrand={selectedBrand}
                onSelectBrand={handleBrandSelect}
                onDeleteBrand={(brandId) => {
                  setBrandToDelete(brandId);
                  setDeleteDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>

          {selectedBrand && (
            <BrandReviewSection
              brandName={selectedBrand.metadata.name}
              logoUrl={selectedBrand.url}
              brand={selectedBrand}
              onRegenerateAsset={handleRegenerateAsset}
            />
          )}
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your brand
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => brandToDelete && handleDeleteBrand(brandToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
