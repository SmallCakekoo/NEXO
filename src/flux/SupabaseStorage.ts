import { supabase } from '../services/Supabase/SupabaseConfig';

/**
 * Upload a profile image to Supabase Storage and return the public URL.
 * @param file - The image file to upload
 * @param userId - The user's unique ID (used for file naming)
 * @returns The public URL of the uploaded image
 */
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  const filePath = `profile/${userId}/${file.name}`;
  const { data, error } = await supabase.storage.from('pictures').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });
  if (error) throw error;

  // Get the public URL
  const { publicUrl } = supabase.storage.from('pictures').getPublicUrl(filePath).data;
  if (!publicUrl) throw new Error('Could not get public URL from Supabase');
  return publicUrl;
}

/**
 * Upload a post image to Supabase Storage and return the public URL.
 * @param file - The image file to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadPostImage(file: File): Promise<string> {
  const filePath = `Posts/images/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('pictures').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });
  if (error) throw error;

  // Get the public URL
  const { publicUrl } = supabase.storage.from('pictures').getPublicUrl(filePath).data;
  if (!publicUrl) throw new Error('Could not get public URL from Supabase');
  return publicUrl;
}

/**
 * Upload a post video to Supabase Storage and return the public URL.
 * @param file - The video file to upload
 * @returns The public URL of the uploaded video
 */
export async function uploadPostVideo(file: File): Promise<string> {
  const filePath = `Posts/videos/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('pictures').upload(filePath, file, {
    cacheControl: '3600',
    upsert: true
  });
  if (error) throw error;

  // Get the public URL
  const { publicUrl } = supabase.storage.from('pictures').getPublicUrl(filePath).data;
  if (!publicUrl) throw new Error('Could not get public URL from Supabase');
  return publicUrl;
}
