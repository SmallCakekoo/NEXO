import { AppDispatcher } from "./Dispatcher";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";

export const PostActions = {
  likePost: (postId: string, userId: string) => {
    // Get user likes from localStorage
    const userLikesKey = 'userLikes';
    let userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '{}');

    // Initialize user's liked list if it doesn't exist
    if (!userLikes[userId]) {
      userLikes[userId] = [];
    }

    // Add post ID to user's liked list and save userLikes
    userLikes[userId].push(postId);
    localStorage.setItem(userLikesKey, JSON.stringify(userLikes));

    // Update the main posts array in localStorage (increment likes)
    const postsKey = 'posts';
    let allPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
    const postIndex = allPosts.findIndex((p: any) => p.id === postId);

    if (postIndex !== -1) {
      allPosts[postIndex].likes = (allPosts[postIndex].likes || 0) + 1;
      localStorage.setItem(postsKey, JSON.stringify(allPosts));

      // Dispatch action to update the store
      AppDispatcher.dispatch({
        type: PostActionTypes.LIKE_POST,
        payload: { postId, userId, likes: allPosts[postIndex].likes }
      });
    } else {
      console.error('Post not found in localStorage posts array during like.');
    }
  },

  unlikePost: (postId: string, userId: string) => {
    // Get user likes from localStorage
    const userLikesKey = 'userLikes';
    let userLikes = JSON.parse(localStorage.getItem(userLikesKey) || '{}');

    // Initialize user's liked list if it doesn't exist
    if (!userLikes[userId]) {
      userLikes[userId] = [];
    }

    // Check if user has already liked this post
    const postIndexInUserLikes = userLikes[userId].indexOf(postId);

    if (postIndexInUserLikes > -1) {
      // User has already liked this post, unlike it
      userLikes[userId].splice(postIndexInUserLikes, 1);
      localStorage.setItem(userLikesKey, JSON.stringify(userLikes));

      // Update the main posts array in localStorage (decrement likes)
      const postsKey = 'posts';
      let allPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
      const postIndex = allPosts.findIndex((p: any) => p.id === postId);

      if (postIndex !== -1) {
        allPosts[postIndex].likes = Math.max(0, (allPosts[postIndex].likes || 0) - 1);
        localStorage.setItem(postsKey, JSON.stringify(allPosts));

        // Dispatch action to update the store
        AppDispatcher.dispatch({
          type: PostActionTypes.UNLIKE_POST,
          payload: { postId, userId, likes: allPosts[postIndex].likes }
        });
      } else {
        console.error('Post not found in localStorage posts array during unlike.');
      }
    } else {
      console.log('User has not liked this post.');
    }
  }
}; 