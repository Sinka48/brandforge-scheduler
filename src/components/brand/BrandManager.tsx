import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2 } from "lucide-react";
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

interface Brand {
  id: string;
  url: string;
  metadata: {
    colors: string[];
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
  version: number;
  created_at: string;
}

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
      const { data, error } = await supabase
        .from("brand_assets")
        .select("*")
        .eq("asset_type", "logo")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }

      setBrands(data || []);
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                  selectedBrand?.id === brand.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleBrandSelect(brand)}
              >
                <CardHeader className="space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Brand v{brand.version}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={brand.url}
                    alt={`Brand v${brand.version}`}
                    className="w-full rounded-lg border"
                  />
                  <div className="grid grid-cols-5 gap-1">
                    {brand.metadata.colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBrandToDelete(brand.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedBrand && (
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BrandReviewSection
                  colors={selectedBrand.metadata.colors}
                  typography={selectedBrand.metadata.typography}
                  logoUrl={selectedBrand.url}
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
