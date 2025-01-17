import { supabase } from "@/lib/supabase";

export async function createRecurringPosts(
  parentPostId: string,
  selectedDate: Date,
  newPost: any,
  endDate: Date
) {
  if (!endDate) return;

  const interval = newPost.recurringPattern || 'daily';
  let currentDate = new Date(selectedDate);
  
  while (currentDate <= endDate) {
    // Skip the first date as it's already created as the parent post
    if (currentDate.getTime() === selectedDate.getTime()) {
      // Move to next date based on interval
      switch (interval) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
      continue;
    }

    // Create child post
    for (const platform of newPost.platforms) {
      const scheduledTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(newPost.time.split(':')[0]),
        parseInt(newPost.time.split(':')[1])
      );

      await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: platform,
          image_url: newPost.image || null,
          scheduled_for: scheduledTime.toISOString(),
          status: 'scheduled',
          is_recurring: true,
          recurrence_pattern: interval,
          recurrence_end_date: endDate.toISOString(),
          parent_post_id: parentPostId
        });
    }

    // Move to next date based on interval
    switch (interval) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }
}