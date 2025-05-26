import { AppDispatcher } from "./Dispatcher";

export const NavigateActionsType = {
  NAVIGATE: "NAVIGATE",
};

export const SignUpActionsType = {
  SIGN_UP: "SIGN_UP",
  SIGN_UP_SUCCESS: "SIGN_UP_SUCCESS",
  SIGN_UP_ERROR: "SIGN_UP_ERROR",
};

export const NavigateActions = {
  navigate: (path: string) => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.NAVIGATE,
      payload: { path },
    });
  },
};

export const SignUpActions = {
  signUp: (userData: {
    username: string;
    email: string;
    phone: string;
    password: string;
    degree: string;
    semester: string;
  }) => {
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP,
      payload: userData,
    });
  },

  signUpSuccess: () => {
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP_SUCCESS,
    });
  },

  signUpError: (error: string) => {
    AppDispatcher.dispatch({
      type: SignUpActionsType.SIGN_UP_ERROR,
      payload: { error },
    });
  },
};
