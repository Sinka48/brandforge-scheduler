import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, RotateCcw } from "lucide-react";

interface Version {
  id: string;
  version: number;
  createdAt: string;
}

interface VersionHistoryProps {
  versions: Version[];
  currentVersion: number;
  onRestore: (version: number) => void;
}

export function VersionHistory({ versions, currentVersion, onRestore }: VersionHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4" />
        <h3 className="text-sm font-medium">Version History</h3>
      </div>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between py-2"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Version {version.version}
                  {version.version === currentVersion && " (Current)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(version.createdAt).toLocaleDateString()}
                </p>
              </div>
              {version.version !== currentVersion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(version.version)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}