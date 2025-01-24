import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
    <div className="space-y-4">
      {brands.map((brand) => (
        <div
          key={brand.id}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            selectedBrand?.id === brand.id
              ? "border-primary bg-primary/5"
              : "border-border"
          }`}
        >
          <button
            onClick={() => onSelectBrand(brand)}
            className="flex items-center space-x-4 flex-1 text-left"
          >
            <img
              src={brand.url}
              alt={brand.metadata?.name || "Brand logo"}
              className="w-12 h-12 object-contain rounded"
            />
            <div>
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
            size="icon"
            onClick={() => onDeleteBrand(brand.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}