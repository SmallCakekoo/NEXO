import { AppDispatcher } from "./Dispatcher";

export const CounterActionTypes = {
  INCREMENT_COUNT: "INCREMENT_COUNT",
  DECREMENT_COUNT: "DECREMENT_COUNT",
};

export const CounterActions = {
  increment: (value: number) => {
    AppDispatcher.dispatch({
      type: CounterActionTypes.INCREMENT_COUNT,
      payload: value,
    });
  },
  decrement: (value: number) => {
    AppDispatcher.dispatch({
      type: CounterActionTypes.DECREMENT_COUNT,
      payload: value,
    });
  },
};

export const UserActionTypes = {
  SAVE_USER: "SAVE_USER",
};

export const UserActions = {
  saveUser: (user: { name: string; age: number }) => {
    AppDispatcher.dispatch({
      type: UserActionTypes.SAVE_USER,
      payload: user,
    });
  },
};
