import { DialogHeader as Header } from "@/components/ui/dialog";

interface DialogHeaderProps {
  editMode?: boolean;
}

export function DialogHeader({ editMode }: DialogHeaderProps) {
  return (
    <Header>
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        {editMode ? "Edit Post" : "Create New Post"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {editMode 
          ? "Make changes to your existing post" 
          : "Create a new post for your social media platforms"
        }
      </p>
    </Header>
  );
}