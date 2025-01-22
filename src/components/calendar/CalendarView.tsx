import { PostList } from "./PostList";
import { useCalendarState } from "./hooks/useCalendarState";
import {
  LoadingState,
  AuthCheckingState,
  UnauthenticatedState,
  ErrorState
} from "./CalendarStates";
import { CalendarContent } from "./calendar-view/CalendarContent";
import { useCalendarData } from "./calendar-view/useCalendarData";
import { Post } from "./types";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onCreatePost?: () => void;
  onPostClick?: (post: Post) => void;
}

export function CalendarView({ 
  selectedDate, 
  onSelectDate, 
  onCreatePost,
  onPostClick
}: CalendarViewProps) {
  const {
    handleDeletePost,
    handleUpdatePost,
    handlePublishPost,
  } = useCalendarState();

  const { 
    session,
    posts,
    isLoading,
    error,
    authLoading
  } = useCalendarData();

  console.log('CalendarView - Fetched posts:', posts);

  const handleEditPost = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  if (authLoading) {
    console.log('Auth loading...');
    return <AuthCheckingState />;
  }

  if (!session) {
    console.log('No session found');
    return <UnauthenticatedState />;
  }

  if (error) {
    console.error('Error in CalendarView:', error);
    return <ErrorState />;
  }

  if (isLoading) {
    console.log('Posts loading...');
    return <LoadingState />;
  }

  return (
    <CalendarContent
      posts={posts || []}
      selectedDate={selectedDate}
      handleDeletePost={handleDeletePost}
      handleEditPost={handleEditPost}
      handlePublishPost={handlePublishPost}
      isLoading={isLoading}
    />
  );
}