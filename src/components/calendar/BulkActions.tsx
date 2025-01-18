import { Button } from "@/components/ui/button";
import { Calendar, Trash2, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface BulkActionsProps {
  selectedPosts: string[];
  onDelete: (postIds: string[]) => void;
  onDuplicate: (postIds: string[]) => void;
  onReschedule: (postIds: string[]) => void;
}

export function BulkActions({
  selectedPosts,
  onDelete,
  onDuplicate,
  onReschedule,
}: BulkActionsProps) {
  const { toast } = useToast();
  
  if (selectedPosts.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedPosts.length} selected
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onDelete(selectedPosts)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(selectedPosts)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onReschedule(selectedPosts)}>
            <Calendar className="mr-2 h-4 w-4" />
            Reschedule
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}