import { AppDispatcher } from './Dispatcher';

export const NavigateActionsType = {
  NAVIGATE: 'NAVIGATE',
  UPDATE_ROUTE: 'UPDATE_ROUTE',
  SET_RETURN_TO_FEED: 'SET_RETURN_TO_FEED',
  SET_RETURN_TO_PROFILE: 'SET_RETURN_TO_PROFILE',
  CLEAR_RETURN_FLAGS: 'CLEAR_RETURN_FLAGS',
} as const;

// type NavigatePayload = {
//   path: string;
//   params?: Record<string, any>;
//   replace?: boolean;  
// };

export const NavigationActions = {
  navigate: (path: string, params?: Record<string, any>, replace = false) => {
    AppDispatcher.dispatch({
      type: replace ? NavigateActionsType.UPDATE_ROUTE : NavigateActionsType.NAVIGATE,
      payload: { path, params }
    });
  },

  replace: (path: string, params?: Record<string, any>) => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.UPDATE_ROUTE,
      payload: { path, params }
    });
  },

  updateRoute: (path: string) => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.UPDATE_ROUTE,
      payload: { path }
    });
  },

  setReturnToFeed: () => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.SET_RETURN_TO_FEED,
    });
  },

  setReturnToProfile: () => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.SET_RETURN_TO_PROFILE,
    });
  },

  clearReturnFlags: () => {
    AppDispatcher.dispatch({
      type: NavigateActionsType.CLEAR_RETURN_FLAGS,
    });
  },
};
