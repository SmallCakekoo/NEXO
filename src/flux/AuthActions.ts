import { AppDispatcher } from "./Dispatcher";

export const AuthActionsType = {
  CHECK_AUTH: "CHECK_AUTH",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
} as const;

export const AuthActions = {
  checkAuth: () => {
    const user = localStorage.getItem("loggedInUser");
    AppDispatcher.dispatch({
      type: AuthActionsType.CHECK_AUTH,
      payload: user ? JSON.parse(user) : null,
    });
  },

  loginSuccess: (userData: any) => {
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    AppDispatcher.dispatch({
      type: AuthActionsType.LOGIN_SUCCESS,
      payload: userData,
    });
  },

  logout: () => {
    localStorage.removeItem("loggedInUser");
    AppDispatcher.dispatch({
      type: AuthActionsType.LOGOUT,
    });
  },
};
