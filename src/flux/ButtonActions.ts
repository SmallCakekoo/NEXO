import { AppDispatcher } from "./Dispatcher";

export const ButtonActionsType = {
  PRIMARY_BUTTON_CLICK: "PRIMARY_BUTTON_CLICK",
} as const;

export const ButtonActions = {
  primaryButtonClick: () => {
    AppDispatcher.dispatch({
      type: ButtonActionsType.PRIMARY_BUTTON_CLICK,
    });
  },
};
