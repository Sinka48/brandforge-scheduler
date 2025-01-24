import { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Trash2, Check, Download } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
          <Card
            key={brand.id}
            className={cn(
              "group relative cursor-pointer p-6 transition-all hover:shadow-md",
              selectedBrand?.id === brand.id
                ? "border-[#9b87f5] bg-[#9b87f5]/10"
                : "hover:border-[#7E69AB]"
            )}
            onClick={() => onSelectBrand(brand)}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={brand.url}
                  alt={brand.metadata.name || "Untitled Brand"}
                  className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-sm"
                />
                {selectedBrand?.id === brand.id && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-[#9b87f5] p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {brand.metadata.name || "Untitled Brand"}
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(brand.url, '_blank');
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
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
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}