
import { Card } from "@/components/ui/card";

export function TwitterFormSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
      </div>
    </Card>
  );
}
