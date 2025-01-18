import { supabase } from "@/integrations/supabase/client";

export async function createBulkPosts(parentPost: any, newPost: any) {
  if (!newPost.bulkDates || newPost.bulkDates.length === 0) return;

  for (const date of newPost.bulkDates) {
    for (const platform of newPost.platforms) {
      await supabase
        .from('posts')
        .insert({
          content: newPost.content,
          platform: platform,
          image_url: newPost.image || null,
          scheduled_for: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            parseInt(newPost.time.split(':')[0]),
            parseInt(newPost.time.split(':')[1])
          ).toISOString(),
          status: 'scheduled',
          batch_id: parentPost.id
        });
    }
  }
}
