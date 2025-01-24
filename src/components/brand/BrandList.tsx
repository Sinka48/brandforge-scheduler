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
              "group relative cursor-pointer rounded-full border transition-all hover:shadow-md",
              selectedBrand?.id === brand.id
                ? "border-[#9b87f5] bg-[#9b87f5]/10"
                : "hover:border-[#7E69AB]"
            )}
            onClick={() => onSelectBrand(brand)}
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