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
    // Get current user info from localStorage
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    } catch (e) {
      console.error("Error getting user information:", e);
      return;
    }

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

    // Get current posts from localStorage
    const currentPosts = JSON.parse(localStorage.getItem("posts") || "[]");

    // Check if post with same ID already exists
    const postExists = currentPosts.some((post: Post) => post.id === newPost.id);
    if (!postExists) {
      // Add the new post to the array
      currentPosts.unshift(newPost);

      // Update localStorage
      localStorage.setItem("posts", JSON.stringify(currentPosts));

      // Dispatch action to update store
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_POST,
        payload: newPost,
      });
    }
  },

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