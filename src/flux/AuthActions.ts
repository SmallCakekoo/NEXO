import { AppDispatcher } from "./Dispatcher";

export const AuthActionsType = {
  CHECK_AUTH: "CHECK_AUTH",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
} as const;

export const AuthActions = {
  checkAuth: () => {
    AppDispatcher.dispatch({
      type: AuthActionsType.CHECK_AUTH,
    });
  },

  loginSuccess: (userData: any) => {
    AppDispatcher.dispatch({
      type: AuthActionsType.LOGIN_SUCCESS,
      payload: userData,
    });
  },

  logout: () => {
    AppDispatcher.dispatch({
      type: AuthActionsType.LOGOUT,
    });
  },
};
