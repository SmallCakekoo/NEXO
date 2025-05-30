import { AppDispatcher } from "./Dispatcher";
import { store } from "./Store";

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
    store.loadPostsFromStorage();
  }
};
