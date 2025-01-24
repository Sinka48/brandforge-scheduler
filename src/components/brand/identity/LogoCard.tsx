import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoCardProps {
  logoUrl: string;
  onDownload?: () => void;
  onCustomize?: () => void;
  compact?: boolean;
}

export function LogoCard({ logoUrl, onDownload, onCustomize, compact = false }: LogoCardProps) {
  return (
    <Card className={compact ? "border-0 shadow-none" : undefined}>
      <CardContent className={compact ? "px-0" : undefined}>
        {logoUrl ? (
          <div className="space-y-4">
            <img
              src={logoUrl}
              alt="Generated logo concept"
              className="w-full max-w-[200px] rounded-lg border mx-auto"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onCustomize}>
                Customize
              </Button>
              <Button size="sm" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your logo concept will appear here after generation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}