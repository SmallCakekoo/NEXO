// services/ImageService.ts
import { supabase } from './supabase';


export class ImageService {
  static async uploadPostImage(file: File, userId?: string): Promise<string | null> {
    try {

      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = userId 
        ? `${userId}/${timestamp}.${fileExt}`
        : `${timestamp}.${fileExt}`;
      
      console.log('Subiendo archivo:', fileName);

      // Subir archivo al bucket 'post-images'
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Obtener URL pública
      const { data: publicURL } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      console.log('Imagen subida exitosamente:', publicURL.publicUrl);
      return publicURL.publicUrl;

    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}