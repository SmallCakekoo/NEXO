import { AppDispatcher } from "./Dispatcher";

export enum TagActionsType {
  SELECT_TAG = "SELECT_TAG",
}

export const TagActions = {
  selectTag(tag: string) {
    AppDispatcher.dispatch({
      type: TagActionsType.SELECT_TAG,
      payload: { tag },
    });
  },
};
