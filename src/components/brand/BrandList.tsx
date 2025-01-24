import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BrandListProps {
  brands: Brand[];
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand) => void;
  onDeleteBrand: (brandId: string) => void;
}

export function BrandList({
  brands,
  selectedBrand,
  onSelectBrand,
  onDeleteBrand,
}: BrandListProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4 pb-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`flex-none w-[300px] rounded-lg border ${
              selectedBrand?.id === brand.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="relative w-full h-32">
              <img
                src={brand.metadata?.socialAssets?.coverImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"}
                alt="Brand cover"
                className="w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => onSelectBrand(brand)}
                  className="flex flex-col items-center space-y-4 w-full text-left"
                >
                  <img
                    src={brand.url}
                    alt={brand.metadata?.name || "Brand logo"}
                    className="w-24 h-24 object-contain rounded-full bg-white shadow-sm -mt-16 border-4 border-white"
                  />
                  <div className="text-center">
                    <h3 className="font-medium">
                      {brand.metadata?.name || "Unnamed Brand"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(brand.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBrand(brand.id)}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Brand
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}