import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoCardProps {
  logoUrl: string;
  onDownload?: () => void;
  onCustomize?: () => void;
}

export function LogoCard({ logoUrl, onDownload, onCustomize }: LogoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Logo Concept
        </CardTitle>
      </CardHeader>
      <CardContent>
        {logoUrl ? (
          <div className="space-y-4">
            <img
              src={logoUrl}
              alt="Generated logo concept"
              className="w-full rounded-lg border"
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