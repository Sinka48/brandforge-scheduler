import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  if (progress === 0) return null;
  
  return <Progress value={progress} className="h-2" />;
}