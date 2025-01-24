import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Brand, BrandAsset } from "@/types/brand";
import { BrandList } from "./BrandList";

interface BrandManagerProps {
  onSelectBrand?: (brand: Brand) => void;
  selectedBrandId?: string;
}

export function BrandManager({ onSelectBrand, selectedBrandId }: BrandManagerProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndFetchBrands = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your brands.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        fetchBrands();
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    checkAuthAndFetchBrands();
  }, [toast]);

  const fetchBrands = async () => {
    try {
      console.log("Fetching brands...");
      const { data, error } = await supabase
        .from("brand_assets")
        .select("*")
        .eq("asset_type", "logo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched brands data:", data);

      const transformedBrands: Brand[] = (data || []).map((item: BrandAsset) => ({
        id: item.id,
        url: item.url,
        metadata: item.metadata || {},
        version: item.version || 1,
        created_at: item.created_at,
        asset_type: item.asset_type,
        questionnaire_id: item.questionnaire_id,
        user_id: item.user_id,
        asset_category: item.asset_category,
        social_asset_type: item.social_asset_type,
        social_name: item.social_name,
        social_bio: item.social_bio
      }));

      console.log("Transformed brands:", transformedBrands);
      setBrands(transformedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast({
        title: "Error",
        description: "Failed to load brands. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    try {
      const { error } = await supabase
        .from("brand_assets")
        .delete()
        .eq("id", brandId);

      if (error) throw error;

      setBrands(brands.filter((brand) => brand.id !== brandId));
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
    onSelectBrand?.(brand);
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
    <div className="space-y-8">
      {brands.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No brands found. Generate and save a brand identity first.
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Brands</CardTitle>
            </CardHeader>
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
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BrandReviewSection
                  brandName={selectedBrand.metadata.name}
                  logoUrl={selectedBrand.url}
                  brand={selectedBrand}
                  onRegenerateAsset={handleRegenerateAsset}
                />
              </CardContent>
            </Card>
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