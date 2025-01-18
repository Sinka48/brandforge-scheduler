import { BrandManager } from "@/components/brand-generator/BrandManager";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PostDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Open Brand Manager</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <BrandManager onSelectBrand={(brand) => {
          console.log("Selected brand:", brand);
          handleClose();
        }} />
      </Dialog>
    </>
  );
}
