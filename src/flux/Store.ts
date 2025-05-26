import { AppDispatcher, Action } from "./Dispatcher";
import { NavigateActionsType } from "./NavigationActions";
import { SignUpActionsType } from "./Actions";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";

export interface State {
  currentPath: string;
  history: string[];
  signUp: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  posts: Post[];
}

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    currentPath: "",
    history: [],
    signUp: {
      loading: false,
      error: null,
      success: false
    },
    posts: [],
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
      case SignUpActionsType.SIGN_UP:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: true,
            error: null,
            success: false
          }
        };
        this._handleSignUp(action.payload);
        break;
      case SignUpActionsType.SIGN_UP_SUCCESS:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: false,
            error: null,
            success: true
          }
        };
        this._emitChange();
        break;
      case SignUpActionsType.SIGN_UP_ERROR:
        if (action.payload && typeof action.payload === "object" && "error" in action.payload) {
          this._myState = {
            ...this._myState,
            signUp: {
              loading: false,
              error: String(action.payload.error),
              success: false
            }
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.LIKE_POST:
        if (action.payload && typeof action.payload === "object" && "postId" in action.payload && "likes" in action.payload) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map(post => 
              post.id === postId ? { ...post, likes: likes } : post
            )
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.UNLIKE_POST:
        if (action.payload && typeof action.payload === "object" && "postId" in action.payload && "likes" in action.payload) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map(post => 
              post.id === postId ? { ...post, likes: likes } : post
            )
          };
          this._emitChange();
        }
        break;
    }
  }

  private _handleSignUp(userData: any): void {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

      // Check for duplicate username or email
      const isDuplicate = existingUsers.some((user: any) => 
        user.username === userData.username || user.email === userData.email
      );

      if (isDuplicate) {
        AppDispatcher.dispatch({
          type: SignUpActionsType.SIGN_UP_ERROR,
          payload: { error: 'Username or email already exists' }
        });
        return;
      }

      // Add new user to localStorage
      existingUsers.push({
        ...userData,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Dispatch success action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_SUCCESS
      });

      // Navigate to feed page (instead of login)
      AppDispatcher.dispatch({
        type: NavigateActionsType.NAVIGATE,
        payload: { path: '/login' }
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: 'An error occurred during sign up' }
      });
    }
  }

  private _emitChange(): void {
    const state = this.getState();
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  // Permite a los componentes suscribirse al store
  subscribe(listener: Listener): () => void {
    this._listeners.push(listener);
    listener(this.getState()); // Emitir estado actual al suscribirse

    // Return an unsubscribe function
    return () => {
      this._listeners = this._listeners.filter((l) => l !== listener);
    };
  }

  load(): void {
    const persistedState = localStorage.getItem("flux:state");
    if (persistedState) {
      this._myState = JSON.parse(persistedState);
    }
    // Load posts from localStorage when the store loads
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      try {
        this._myState.posts = JSON.parse(storedPosts);
      } catch (e) {
        console.error("Error loading posts from localStorage", e);
        this._myState.posts = []; // Reset posts if there's an error
      }
    }
    this._emitChange(); // Emit the new state
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
