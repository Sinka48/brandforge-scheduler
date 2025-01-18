import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface DraftFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  sortBy: "date" | "content";
  setSortBy: (sort: "date" | "content") => void;
  platforms: any[];
}

export function DraftFilters({
  searchQuery,
  setSearchQuery,
  selectedPlatform,
  setSelectedPlatform,
  sortBy,
  setSortBy,
  platforms
}: DraftFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <Select value={sortBy} onValueChange={(value: "date" | "content") => setSortBy(value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Sort by Date</SelectItem>
          <SelectItem value="content">Sort by Content</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          {platforms.map((platform) => (
            <SelectItem key={platform.id} value={platform.id}>
              <div className="flex items-center gap-2">
                {platform.icon}
                {platform.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search drafts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
}