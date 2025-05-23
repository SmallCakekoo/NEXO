import { AppDispatcher } from './Dispatcher';

export const NavigateActionsType = {
  NAVIGATE: 'NAVIGATE',
  UPDATE_ROUTE: 'UPDATE_ROUTE'
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
  }
};
