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
