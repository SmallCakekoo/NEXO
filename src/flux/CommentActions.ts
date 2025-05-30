import { AppDispatcher } from "./Dispatcher";

export enum CommentActionsType {
  ADD_COMMENT = "ADD_COMMENT",
}

export interface Comment {
  photo: string;
  name: string;
  career: string;
  date: string;
  message: string;
}

export const CommentActions = {
  addComment(comment: Comment) {
    AppDispatcher.dispatch({
      type: CommentActionsType.ADD_COMMENT,
      payload: comment,
    });
  },
};
