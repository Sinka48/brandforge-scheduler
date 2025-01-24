import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-4 p-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={cn(
              "group relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
              selectedBrand?.id === brand.id
                ? "border-[#9b87f5] bg-[#9b87f5]/10"
                : "hover:border-[#7E69AB]"
            )}
            onClick={() => onSelectBrand(brand)}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <img
                  src={brand.url}
                  alt={brand.metadata.name || `Brand v${brand.version}`}
                  className="h-16 w-16 rounded-full object-cover"
                />
                {selectedBrand?.id === brand.id && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-[#9b87f5] p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-medium">{brand.metadata.name || "Untitled"}</h3>
                <p className="text-sm text-muted-foreground">v{brand.version}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBrand(brand.id);
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
  );
}