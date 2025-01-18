import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TypographyCardProps {
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  onCustomize?: (typography: { headingFont: string; bodyFont: string }) => void;
}

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Playfair Display",
  "Merriweather",
];

export function TypographyCard({ typography, onCustomize }: TypographyCardProps) {
  const handleFontChange = (type: 'headingFont' | 'bodyFont', value: string) => {
    if (onCustomize) {
      onCustomize({
        ...typography,
        [type]: value,
      });
    }
  };

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
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Heading Font</h4>
              <div className="space-y-4">
                <Select
                  value={typography.headingFont}
                  onValueChange={(value) => handleFontChange('headingFont', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <p style={{ fontFamily: typography.headingFont }} className="text-2xl">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <ToggleGroup type="single" defaultValue="left">
                    <ToggleGroupItem value="left">
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center">
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right">
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Body Font</h4>
              <div className="space-y-4">
                <Select
                  value={typography.bodyFont}
                  onValueChange={(value) => handleFontChange('bodyFont', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p style={{ fontFamily: typography.bodyFont }} className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
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