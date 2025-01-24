import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface BrandManagerProps {
  onSelectBrand?: (brand: Brand) => void;
  selectedBrandId?: string;
}

interface DatabaseBrandAsset {
  id: string;
  url: string;
  metadata: unknown;
  version: number;
  created_at: string;
  asset_type: string;
  questionnaire_id: string;
  user_id: string;
  social_name?: string;
  social_bio?: string;
  asset_category?: string;
  social_asset_type?: string;
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
        .eq("asset_type", "brand_identity")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching brands:", error);
        throw error;
      }

      // Transform the data to match the Brand type with proper type checking
      const transformedBrands: Brand[] = (data as DatabaseBrandAsset[]).map((item) => {
        const metadata = item.metadata as {
          colors: string[];
          typography: {
            headingFont: string;
            bodyFont: string;
          };
        };

        return {
          id: item.id,
          url: item.url,
          metadata: {
            colors: Array.isArray(metadata?.colors) ? metadata.colors : [],
            typography: {
              headingFont: metadata?.typography?.headingFont || "",
              bodyFont: metadata?.typography?.bodyFont || "",
            },
          },
          version: item.version || 1,
          created_at: item.created_at,
          asset_type: item.asset_type,
          questionnaire_id: item.questionnaire_id,
          user_id: item.user_id,
          social_name: item.social_name,
          social_bio: item.social_bio,
          asset_category: item.asset_category,
          social_asset_type: item.social_asset_type,
        };
      });

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
              <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-4 p-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className={cn(
                        "group relative cursor-pointer rounded-full border transition-all hover:shadow-md",
                        selectedBrand?.id === brand.id
                          ? "border-[#9b87f5] bg-[#9b87f5]/10"
                          : "hover:border-[#7E69AB]"
                      )}
                      onClick={() => handleBrandSelect(brand)}
                    >
                      <div className="flex items-center space-x-2 px-4 py-2">
                        <div className="relative h-8 w-8">
                          <img
                            src={brand.url}
                            alt={`Brand v${brand.version}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                          {selectedBrand?.id === brand.id && (
                            <div className="absolute -right-1 -top-1 rounded-full bg-[#9b87f5] p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">v{brand.version}</span>
                        <TooltipProvider>
                          <div className="flex space-x-1">
                            {brand.metadata.colors.map((color, index) => (
                              <Tooltip key={index}>
                                <TooltipTrigger>
                                  <div
                                    className="h-4 w-4 rounded-full border"
                                    style={{ backgroundColor: color }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBrandToDelete(brand.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>

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
                  brandName={selectedBrand.social_name}
                  socialBio={selectedBrand.social_bio}
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