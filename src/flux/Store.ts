import { AppDispatcher, Action } from "./Dispatcher";
import { NavigateActionsType } from "./NavigationActions";

export interface State {
  currentPath: string;
  history: string[];
}

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    currentPath: "",
    history: []
  };

  // Los componentes
  private _listeners: Listener[] = [];

  private static instance: Store;

  private constructor() {
    this._listeners = [];
    AppDispatcher.register(this._handleActions.bind(this));

    // Manejar cambios en el historial del navegador
    window.addEventListener('popstate', () => {
      const newPath = window.location.pathname;
      this._handleRouteChange(newPath);
    });
  }

  private _handleRouteChange(newPath: string) {
    this._myState = {
      ...this._myState,
      currentPath: newPath,
      history: [...this._myState.history, newPath]
    };
    this._emitChange();
  }

  getState() {
    return this._myState;
  }

  _handleActions(action: Action): void {
    switch (action.type) {
      case NavigateActionsType.NAVIGATE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar el historial del navegador
          window.history.pushState({}, '', newPath);
          this._handleRouteChange(newPath);
        }
        break;
      case NavigateActionsType.UPDATE_ROUTE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar la URL sin agregar una nueva entrada al historial
          window.history.replaceState({}, '', newPath);
          this._handleRouteChange(newPath);
        }
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

  load(): void {
    const persistedState = localStorage.getItem("flux:state");
    if (persistedState) {
      this._myState = JSON.parse(persistedState);
      this._emitChange(); // Emitir el nuevo estado
    }
  }

  static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }
}

export const store = Store.getInstance();
export default store;
