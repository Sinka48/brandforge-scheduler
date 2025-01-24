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
            className={`flex-none w-[300px] p-4 rounded-lg border ${
              selectedBrand?.id === brand.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => onSelectBrand(brand)}
                className="flex flex-col items-center space-y-4 w-full text-left"
              >
                <img
                  src={brand.url}
                  alt={brand.metadata?.name || "Brand logo"}
                  className="w-32 h-32 object-contain rounded"
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
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}