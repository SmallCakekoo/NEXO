import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { store } from "./Store";

export const PostActions = {
  likePost(postId: string, userId: string) {
    // Get current likes from localStorage
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find((p: any) => p.id === postId);
    
    if (post) {
      post.likes = (post.likes || 0) + 1;
      localStorage.setItem("posts", JSON.stringify(posts));
      
      // Update store
      store.saveUserLikes(userId, postId, true);
      
      AppDispatcher.dispatch({
        type: PostActionTypes.LIKE_POST,
        payload: {
          postId,
          likes: post.likes,
        },
      });
    }
  },

  unlikePost(postId: string, userId: string) {
    // Get current likes from localStorage
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find((p: any) => p.id === postId);
    
    if (post && post.likes > 0) {
      post.likes = post.likes - 1;
      localStorage.setItem("posts", JSON.stringify(posts));
      
      // Update store
      store.saveUserLikes(userId, postId, false);
      
      AppDispatcher.dispatch({
        type: PostActionTypes.UNLIKE_POST,
        payload: {
          postId,
          likes: post.likes,
        },
      });
    }
  },

  // ... rest of the existing code ...
}; 