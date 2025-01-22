import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircle, Loader2, Lock } from "lucide-react";

export function LoadingState() {
  return (
    <EmptyState
      icon={Loader2}
      title="Loading posts..."
      description="Please wait while we fetch your posts"
    />
  );
}

export function AuthCheckingState() {
  return (
    <EmptyState
      icon={Loader2}
      title="Checking authentication..."
      description="Please wait while we verify your credentials"
    />
  );
}

export function UnauthenticatedState() {
  return (
    <EmptyState
      icon={Lock}
      title="Sign in required"
      description="Please sign in to view your posts"
    />
  );
}

export function ErrorState() {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Error loading posts"
      description="There was a problem loading your posts. Please try again."
    />
  );
}