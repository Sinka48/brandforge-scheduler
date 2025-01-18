import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Scale } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface LogoGuidelinesCardProps {
  logoUrl: string;
}

export function LogoGuidelinesCard({ logoUrl }: LogoGuidelinesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Logo Usage Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Minimum Size</h4>
            <div className="relative aspect-square w-12 border rounded-lg p-2">
              <img src={logoUrl} alt="Minimum size example" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-muted-foreground">
              Minimum size: 32px height
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Clear Space</h4>
            <div className="relative aspect-square w-24 border rounded-lg p-4">
              <div className="border-2 border-dashed border-muted p-2">
                <img src={logoUrl} alt="Clear space example" className="w-full h-full object-contain" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep clear space equal to logo height/4
            </p>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium">Usage Guidelines</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Don't stretch or distort the logo</li>
            <li>• Don't change the logo colors</li>
            <li>• Don't add effects or shadows</li>
            <li>• Don't rotate the logo</li>
            <li>• Ensure adequate contrast with backgrounds</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}