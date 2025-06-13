import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { store } from "./Store";
import { ImageService} from '../services/Supabase/ImageService';

export const PostActions = {
  async createPost(postData: {
    content: string;
    category: string;
    image: File | null;
    createdAt: string;
    uploadImage: string | null;
  }) {
    try {
      let imageUrl: string | null = null;

      // Si hay una imagen, subirla a Supabase Storage primero
      if (postData.image) {
        console.log('Subiendo imagen a Supabase...');
        
        const uploadResult = await ImageService.uploadPostImage(postData.image);
        
        if (uploadResult) {
          imageUrl = uploadResult;
          console.log('Imagen subida exitosamente:', imageUrl);
        } else {
          console.error('Error al subir imagen');
          throw new Error('Error al subir la imagen');
        }
      }

      // Crear el post con la URL de la imagen (si existe)
      const postWithImage = {
        ...postData,
        imageUrl: imageUrl // Agregar la URL de la imagen al objeto del post
      };

      // Llamar al store para crear el post
      store.createPost(postWithImage);

    } catch (error) {
      console.error('Error en createPost:', error);
      
      // Aquí puedes manejar el error como prefieras
      // Por ejemplo, dispatching una acción de error
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_POST,
        payload: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  },

  likePost(postId: string, userId: string) {
    store.updatePostLikes(postId, userId, true);
  },

  unlikePost(postId: string, userId: string) {
    store.updatePostLikes(postId, userId, false);
  },

  // ... rest of the existing code ...
};