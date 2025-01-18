import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PLATFORMS } from "@/constants/platforms";

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  selectedStatuses: ('draft' | 'scheduled' | 'published')[];
  onStatusChange: (statuses: ('draft' | 'scheduled' | 'published')[]) => void;
}

export function Filters({
  searchQuery,
  onSearchChange,
  selectedPlatforms,
  onPlatformChange,
  selectedStatuses,
  onStatusChange,
}: FiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 w-[200px]"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Platforms</DropdownMenuLabel>
          {PLATFORMS.map((platform) => (
            <DropdownMenuCheckboxItem
              key={platform.id}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={(checked) => {
                onPlatformChange(
                  checked
                    ? [...selectedPlatforms, platform.id]
                    : selectedPlatforms.filter((p) => p !== platform.id)
                );
              }}
            >
              <platform.icon className="mr-2 h-4 w-4" />
              {platform.name}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {['draft', 'scheduled', 'published'].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={selectedStatuses.includes(status as any)}
              onCheckedChange={(checked) => {
                onStatusChange(
                  checked
                    ? [...selectedStatuses, status as any]
                    : selectedStatuses.filter((s) => s !== status)
                );
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}