import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded-md border bg-background">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}