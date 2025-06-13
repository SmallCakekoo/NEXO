import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { store } from "./Store";
import { uploadPostImage, uploadPostVideo } from './SupabaseStorage';

export const PostActions = {
  async createPost(postData: {
    content: string;
    category: string;
    imageFile?: File | null;
    videoFile?: File | null;
    createdAt: string;
  }) {
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let mediaType: 'image' | 'video' | null = null;

    if (postData.imageFile) {
      imageUrl = await uploadPostImage(postData.imageFile);
      mediaType = 'image';
    } else if (postData.videoFile) {
      videoUrl = await uploadPostVideo(postData.videoFile);
      mediaType = 'video';
    }

    store.createPost({
      content: postData.content,
      category: postData.category,
      image: imageUrl,
      video: videoUrl,
      mediaType: mediaType,
      createdAt: postData.createdAt,
    });
  },

  async likePost(postId: string, userId: string) {
    await store.updatePostLikes(postId, userId, true);
  },

  async unlikePost(postId: string, userId: string) {
    await store.updatePostLikes(postId, userId, false);
  },

  async uploadPostImage(file: File): Promise<string> {
    return await uploadPostImage(file);
  },

  async uploadPostVideo(file: File): Promise<string> {
    return await uploadPostVideo(file);
  },

  // ... rest of the existing code ...
};