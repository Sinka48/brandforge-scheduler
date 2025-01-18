import { format, isAfter, isSameDay, startOfDay } from "date-fns";

export const filterPostsByDate = (posts: any[], selectedDate: Date | undefined) => {
  const now = startOfDay(new Date());
  const upcomingPosts = posts
    .filter(post => post.status === 'scheduled' && 
      (isAfter(post.date, now) || isSameDay(post.date, now)))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (selectedDate) {
    return posts.filter(post => isSameDay(post.date, selectedDate));
  }

  return upcomingPosts;
};

export const formatPostDate = (date: Date) => {
  return format(date, 'MMMM d, yyyy');
};