import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { store } from "./Store";

export const PostActions = {
  createPost(postData: {
    content: string;
    category: string;
    image: string | null; // Cambio de File (base64)
    createdAt: string;
  }) {
    store.createPost(postData);
  },

  async likePost(postId: string, userId: string) {
    await store.updatePostLikes(postId, userId, true);
  },

  async unlikePost(postId: string, userId: string) {
    await store.updatePostLikes(postId, userId, false);
  },

  // ... rest of the existing code ...
};