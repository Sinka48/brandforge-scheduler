import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Brand } from "@/types/brand";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Trash2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./ColorPicker";
import { FontPicker } from "./FontPicker";
import { ImageUploader } from "./ImageUploader";

interface BrandManagerProps {
  selectedBrandId?: string;
  onSelectBrand?: (brand: Brand) => void;
}

export function BrandManager({ selectedBrandId, onSelectBrand }: BrandManagerProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const { toast } = useToast();

  const { data: brandAssets } = useQuery({
    queryKey: ['brand-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_assets')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match the Brand type
      return (data || []).map(asset => ({
        ...asset,
        metadata: typeof asset.metadata === 'string' 
          ? JSON.parse(asset.metadata)
          : asset.metadata
      })) as Brand[];
    }
  });

  const handleUpload = async (file: File) => {
    try {
      const { data, error } = await supabase.storage
        .from('brand-assets')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand asset uploaded successfully",
      });

      return data.path;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload brand asset",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (brandId: string) => {
    try {
      const { error } = await supabase
        .from('brand_assets')
        .delete()
        .eq('id', brandId);

      if (error) throw error;

      setBrands(brands.filter(brand => brand.id !== brandId));
      
      toast({
        title: "Success",
        description: "Brand asset deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand asset",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Brand Manager</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Brand
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px,1fr]">
        <Card className="p-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-4">
              {brandAssets?.map((brand) => (
                <Card
                  key={brand.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedBrand(brand)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{brand.asset_type}</h3>
                      <p className="text-sm text-muted-foreground">
                        Version {brand.version}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(brand.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6">
          {selectedBrand ? (
            <Tabs defaultValue="colors">
              <TabsList>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="assets">Assets</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-4">
                <ColorPicker
                  colors={selectedBrand.metadata.colors}
                  onChange={(colors) => {
                    setSelectedBrand({
                      ...selectedBrand,
                      metadata: {
                        ...selectedBrand.metadata,
                        colors,
                      },
                    });
                  }}
                />
              </TabsContent>

              <TabsContent value="typography" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <FontPicker
                      value={selectedBrand.metadata.typography.headingFont}
                      onChange={(font) => {
                        setSelectedBrand({
                          ...selectedBrand,
                          metadata: {
                            ...selectedBrand.metadata,
                            typography: {
                              ...selectedBrand.metadata.typography,
                              headingFont: font,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <FontPicker
                      value={selectedBrand.metadata.typography.bodyFont}
                      onChange={(font) => {
                        setSelectedBrand({
                          ...selectedBrand,
                          metadata: {
                            ...selectedBrand.metadata,
                            typography: {
                              ...selectedBrand.metadata.typography,
                              bodyFont: font,
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assets" className="space-y-4">
                <ImageUploader onUpload={handleUpload} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Brand Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a brand from the list or create a new one to get started
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}