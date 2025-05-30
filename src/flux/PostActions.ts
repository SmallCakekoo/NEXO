import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { store } from "./Store";

export const PostActions = {
  createPost(postData: {
    content: string;
    category: string;
    image: File | null;
    createdAt: string;
  }) {
    // Get current user info from the store
    const user = store.getState().auth.user;

    if (!user) {
      console.error("No logged in user found");
      return;
    }

    const name = user?.username || "Unknown User";
    const career = user?.degree || "Unknown Career";
    const semestre = user?.semester || "";
    let photo = user?.profilePic;
    if (!photo && postData.image) {
      photo = URL.createObjectURL(postData.image);
    } else if (!photo) {
      photo = `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`;
    }

    // Create a new post object
    const newPost: Post = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      photo: photo,
      name: name,
      date: new Date().toLocaleDateString(),
      career: career,
      semestre: semestre,
      message: postData.content,
      tag: postData.category,
      likes: 0,
      share: "0",
      comments: [],
    };

    // Dispatch action to add the new post to the store
    // The store will handle updating its state and persisting to localStorage
    AppDispatcher.dispatch({
      type: PostActionTypes.ADD_POST,
      payload: newPost,
    });
  },

  likePost(postId: string, userId: string) {
    // Update user likes in the store (persists to localStorage)
    store.saveUserLikes(userId, postId, true);
    
    // Dispatch action to update the post's like count in the store
    // The store will handle updating its state and persisting to localStorage
    AppDispatcher.dispatch({
      type: PostActionTypes.LIKE_POST,
      payload: { postId, userId }, // Pass postId and userId for the store to handle the logic
    });
  },

  unlikePost(postId: string, userId: string) {
    // Update user likes in the store (persists to localStorage)
    store.saveUserLikes(userId, postId, false);
    
    // Dispatch action to update the post's like count in the store
    // The store will handle updating its state and persisting to localStorage
    AppDispatcher.dispatch({
      type: PostActionTypes.UNLIKE_POST,
      payload: { postId, userId }, // Pass postId and userId for the store to handle the logic
    });
  },

  // ... rest of the existing code ...
}; 