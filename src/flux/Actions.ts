import { AppDispatcher } from "./Dispatcher";

export const NavigateActionsType = {
  NAVIGATE: "NAVIGATE",
};

export const NavigateActions = {
  navigate: (path: string) => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.NAVIGATE,
      payload: { path },
    });
  },
};
