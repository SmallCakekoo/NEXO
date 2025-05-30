import { AppDispatcher } from "./Dispatcher";

export enum FeedActionsType {
  OPEN_POST_MODAL = "OPEN_POST_MODAL",
  CLOSE_POST_MODAL = "CLOSE_POST_MODAL",
  SHARE_POST = "SHARE_POST",
  LOAD_POSTS_FROM_STORAGE = "LOAD_POSTS_FROM_STORAGE"
}

export const FeedActions = {
  openPostModal: (postId: string) => {
    AppDispatcher.dispatch({
      type: FeedActionsType.OPEN_POST_MODAL,
      payload: { postId },
    });
  },

  closePostModal: () => {
    AppDispatcher.dispatch({
      type: FeedActionsType.CLOSE_POST_MODAL,
    });
  },

  sharePost: (postId: string) => {
    AppDispatcher.dispatch({
      type: FeedActionsType.SHARE_POST,
      payload: { postId },
    });
  },

  refreshFeedFromStorage: () => {
    try {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      AppDispatcher.dispatch({
        type: FeedActionsType.LOAD_POSTS_FROM_STORAGE,
        payload: { posts }
      });
    } catch (error) {
      console.error("Failed to refresh feed from storage:", error);
      // Optionally dispatch an error action
    }
  }
};
