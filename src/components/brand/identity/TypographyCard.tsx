import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TypographyCardProps {
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  onCustomize?: (typography: { headingFont: string; bodyFont: string }) => void;
}

export function TypographyCard({ typography, onCustomize }: TypographyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          Typography
        </CardTitle>
      </CardHeader>
      <CardContent>
        {typography ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Heading Font</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm">{typography.headingFont}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCustomize?.(typography)}
                >
                  Customize
                </Button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Body Font</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm">{typography.bodyFont}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCustomize?.(typography)}
                >
                  Customize
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your brand typography recommendations will appear here after generation.
          </p>
        )}
      </CardContent>
    </Card>
  );
}