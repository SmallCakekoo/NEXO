import { AppDispatcher, Action } from "./Dispatcher";
import { CounterActionTypes, UserActionTypes } from "./Actions";

export type User = {
  name: string;
  age: number;
};

export type State = {
  count: number;
  user: User | null;
};

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    count: 0,
    user: null,
  };
  // Los componentes
  private _listeners: Listener[] = [];

  constructor() {
    AppDispatcher.register(this._handleActions.bind(this)); // Bind the context of this method to the Store instance
  }

  getState() {
    return this._myState;
  }

  _handleActions(action: Action): void {
    switch (action.type) {
      case CounterActionTypes.INCREMENT_COUNT:
        if (typeof action.payload === "number") {
          this._myState = {
            ...this._myState,
            count: this._myState.count + action.payload,
          };
        }
        this._emitChange();
        break;

      case CounterActionTypes.DECREMENT_COUNT:
        if (typeof action.payload === "number") {
          this._myState = {
            ...this._myState,
            count: this._myState.count - action.payload,
          };
        }
        this._emitChange();
        break;

      case UserActionTypes.SAVE_USER:
        if (typeof action.payload === "object") {
          this._myState = {
            ...this._myState,
            user: action.payload as User,
          };
        }
        this._emitChange();
        break;
    }
  }

  private _emitChange(): void {
    const state = this.getState();
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  // Permite a los componentes suscribirse al store
  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this.getState()); // Emitir estado actual al suscribirse
  }

  // Permite quitar la suscripción
  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
}

export const store = new Store();
