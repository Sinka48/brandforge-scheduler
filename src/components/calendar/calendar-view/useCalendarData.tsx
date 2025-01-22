import { usePostQuery } from "@/hooks/post/usePostQuery";
import { usePostData } from "@/hooks/post/usePostData";

export function useCalendarData() {
  const { data: session, isLoading: authLoading } = usePostQuery();
  const { data: posts, isLoading, error } = usePostData(session);

  return {
    session,
    posts,
    isLoading,
    error,
    authLoading
  };
}