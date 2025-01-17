import { DialogHeader as Header, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface DialogHeaderProps {
  editMode: boolean;
  selectedDate?: Date;
}

export function DialogHeader({ editMode, selectedDate }: DialogHeaderProps) {
  return (
    <>
      <Header>
        <DialogTitle>{editMode ? 'Edit Post' : 'Create New Post'}</DialogTitle>
      </Header>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
      </div>
    </>
  );
}