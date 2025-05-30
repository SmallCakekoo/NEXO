import { AppDispatcher } from "./Dispatcher";

export enum FeedActionsType {
  OPEN_POST_MODAL = "OPEN_POST_MODAL",
  CLOSE_POST_MODAL = "CLOSE_POST_MODAL",
  SHARE_POST = "SHARE_POST",
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
};
