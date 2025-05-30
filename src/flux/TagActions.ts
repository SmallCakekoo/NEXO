import { AppDispatcher } from "./Dispatcher";
import { TagActionTypes } from "../types/feed/TagActionTypes";

export const TagActions = {
  selectTag(tag: string) {
    AppDispatcher.dispatch({
      type: TagActionTypes.SELECT_TAG,
      payload: tag
    });
  }
};
