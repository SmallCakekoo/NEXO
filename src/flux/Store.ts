import { AppDispatcher, Action } from "./Dispatcher";
import { NavigateActionsType } from "./NavigationActions";
import { SignUpActionsType, SelectionActionsType } from "./Actions";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { AuthActionsType } from "./AuthActions";

export interface Rating {
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

export interface Ratings {
  [key: string]: Rating[];
}

interface TeacherRatingPayload {
  teacherName: string;
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

interface SubjectRatingPayload {
  subjectName: string;
  rating: number;
  comment: string;
  timestamp: string;
  author?: string;
  image?: string;
}

interface UpdateTeacherRatingPayload {
  teacherName: string;
  rating: number;
}

interface UpdateSubjectRatingPayload {
  subjectName: string;
  rating: number;
}

export interface State {
  currentPath: string;
  history: string[];
  auth: {
    isAuthenticated: boolean;
    user: any | null;
  };
  signUp: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
  posts: Post[];
  teacherRatings: Ratings;
  subjectRatings: Ratings;
  selectedTeacher: any | null;
  selectedSubject: any | null;
}

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    currentPath: "",
    history: [],
    auth: {
      isAuthenticated: false,
      user: null,
    },
    signUp: {
      loading: false,
      error: null,
      success: false,
    },
    posts: [],
    teacherRatings: {},
    subjectRatings: {},
    selectedTeacher: null,
    selectedSubject: null,
  };

  // Los componentes
  private _listeners: Listener[] = [];

  private static instance: Store;

  private constructor() {
    this._listeners = [];
    AppDispatcher.register(this._handleActions.bind(this));

    // Manejar cambios en el historial del navegador
    window.addEventListener("popstate", () => {
      const newPath = window.location.pathname;
      this._handleRouteChange(newPath);
    });
  }

  private _handleRouteChange(newPath: string) {
    // Lista de rutas públicas
    const publicRoutes = ["/", "/login", "/signup"];

    // Si la ruta no es pública y el usuario no está autenticado, redirigir a la landing
    if (!publicRoutes.includes(newPath) && !this._myState.auth.isAuthenticated) {
      window.history.replaceState({}, "", "/");
      this._myState = {
        ...this._myState,
        currentPath: "/",
        history: [...this._myState.history, "/"],
      };
    } else {
      this._myState = {
        ...this._myState,
        currentPath: newPath,
        history: [...this._myState.history, newPath],
      };
    }
    this._emitChange();
  }

  getState() {
    return this._myState;
  }

  _handleActions(action: Action): void {
    switch (action.type) {
      case AuthActionsType.CHECK_AUTH:
      case AuthActionsType.LOGIN_SUCCESS:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: true,
              user: action.payload,
            },
          };
          // Si el usuario está en una ruta pública, redirigir al feed
          if (["/", "/login", "/signup"].includes(this._myState.currentPath)) {
            window.history.replaceState({}, "", "/feed");
            this._handleRouteChange("/feed");
          }
        }
        break;

      case AuthActionsType.LOGOUT:
        this._myState = {
          ...this._myState,
          auth: {
            isAuthenticated: false,
            user: null,
          },
        };
        window.history.replaceState({}, "", "/");
        this._handleRouteChange("/");
        break;
      case NavigateActionsType.NAVIGATE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar el historial del navegador
          window.history.pushState({}, "", newPath);
          this._handleRouteChange(newPath);
        }
        break;
      case NavigateActionsType.UPDATE_ROUTE:
        if (action.payload && typeof action.payload === "object" && "path" in action.payload) {
          const newPath = String(action.payload.path);
          // Actualizar la URL sin agregar una nueva entrada al historial
          window.history.replaceState({}, "", newPath);
          this._handleRouteChange(newPath);
        }
        break;
      case SignUpActionsType.SIGN_UP:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: true,
            error: null,
            success: false,
          },
        };
        this._handleSignUp(action.payload);
        break;
      case SignUpActionsType.SIGN_UP_SUCCESS:
        this._myState = {
          ...this._myState,
          signUp: {
            loading: false,
            error: null,
            success: true,
          },
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
              success: false,
            },
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.LIKE_POST:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "postId" in action.payload &&
          "likes" in action.payload
        ) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map((post) =>
              post.id === postId ? { ...post, likes: likes } : post
            ),
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.UNLIKE_POST:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "postId" in action.payload &&
          "likes" in action.payload
        ) {
          const postId = String(action.payload.postId);
          const likes = Number(action.payload.likes);
          this._myState = {
            ...this._myState,
            posts: this._myState.posts.map((post) =>
              post.id === postId ? { ...post, likes: likes } : post
            ),
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_TEACHER_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "teacherName" in action.payload
        ) {
          const payload = action.payload as TeacherRatingPayload;
          const { teacherName, rating, comment, timestamp, author, image } = payload;
          const currentRatings = this._myState.teacherRatings[teacherName] || [];
          this._myState = {
            ...this._myState,
            teacherRatings: {
              ...this._myState.teacherRatings,
              [teacherName]: [...currentRatings, { rating, comment, timestamp, author, image }],
            },
          };
          // Persist ratings to localStorage
          localStorage.setItem("teacherRatings", JSON.stringify(this._myState.teacherRatings));
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_SUBJECT_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "subjectName" in action.payload
        ) {
          const payload = action.payload as SubjectRatingPayload;
          const { subjectName, rating, comment, timestamp, author, image } = payload;
          const currentRatings = this._myState.subjectRatings[subjectName] || [];
          this._myState = {
            ...this._myState,
            subjectRatings: {
              ...this._myState.subjectRatings,
              [subjectName]: [...currentRatings, { rating, comment, timestamp, author, image }],
            },
          };
          // Persist ratings to localStorage
          localStorage.setItem("subjectRatings", JSON.stringify(this._myState.subjectRatings));
          this._emitChange();
        }
        break;
      case PostActionTypes.UPDATE_TEACHER_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "teacherName" in action.payload
        ) {
          const payload = action.payload as UpdateTeacherRatingPayload;
          const { teacherName, rating } = payload;
          const ratings = this._myState.teacherRatings[teacherName] || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : rating;

          // Update the rating in localStorage for the teacher card
          const teacherData = JSON.parse(localStorage.getItem("selectedTeacher") || "{}");
          if (teacherData.name === teacherName) {
            teacherData.rating = averageRating.toFixed(1);
            localStorage.setItem("selectedTeacher", JSON.stringify(teacherData));
          }
          this._emitChange();
        }
        break;
      case PostActionTypes.UPDATE_SUBJECT_RATING:
        if (
          action.payload &&
          typeof action.payload === "object" &&
          "subjectName" in action.payload
        ) {
          const payload = action.payload as UpdateSubjectRatingPayload;
          const { subjectName, rating } = payload;
          const ratings = this._myState.subjectRatings[subjectName] || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : rating;

          // Update the rating in localStorage for the subject card
          const subjectData = JSON.parse(localStorage.getItem("selectedSubject") || "{}");
          if (subjectData.name === subjectName) {
            subjectData.rating = averageRating.toFixed(1);
            localStorage.setItem("selectedSubject", JSON.stringify(subjectData));
          }
          this._emitChange();
        }
        break;
      case PostActionTypes.LOAD_POSTS:
        if (action.payload && Array.isArray(action.payload)) {
          this._myState = {
            ...this._myState,
            posts: action.payload,
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_POST:
        if (action.payload && typeof action.payload === "object") {
          const newPost = action.payload as Post;
          this._myState = {
            ...this._myState,
            posts: [newPost, ...this._myState.posts],
          };
          this._emitChange();
        }
        break;
      case SelectionActionsType.SELECT_TEACHER:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            selectedTeacher: action.payload,
          };
          this._emitChange();
        }
        break;
      case SelectionActionsType.SELECT_SUBJECT:
        if (action.payload) {
          this._myState = {
            ...this._myState,
            selectedSubject: action.payload,
          };
          this._emitChange();
        }
        break;
    }
  }

  private _handleSignUp(userData: any): void {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Check for duplicate username or email
      const isDuplicate = existingUsers.some(
        (user: any) => user.username === userData.username || user.email === userData.email
      );

      if (isDuplicate) {
        AppDispatcher.dispatch({
          type: SignUpActionsType.SIGN_UP_ERROR,
          payload: { error: "Username or email already exists" },
        });
        return;
      }

      // Add new user to localStorage
      existingUsers.push({
        ...userData,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Dispatch success action
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_SUCCESS,
      });

      // Hacer login automático después del registro
      AppDispatcher.dispatch({
        type: AuthActionsType.LOGIN_SUCCESS,
        payload: userData,
      });
    } catch (error) {
      AppDispatcher.dispatch({
        type: SignUpActionsType.SIGN_UP_ERROR,
        payload: { error: "An error occurred during sign up" },
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
    // Cargar datos existentes
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      this._myState = {
        ...this._myState,
        auth: {
          isAuthenticated: true,
          user: JSON.parse(user),
        },
      };

      // Si el usuario está en una ruta pública, redirigir al feed
      if (["/", "/login", "/signup"].includes(window.location.pathname)) {
        window.history.replaceState({}, "", "/feed");
        this._handleRouteChange("/feed");
        return;
      }
    }

    const persistedState = localStorage.getItem("flux:state");
    if (persistedState) {
      this._myState = JSON.parse(persistedState);
    }
    // Load posts from localStorage when the store loads
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
      try {
        this._myState.posts = JSON.parse(storedPosts);
      } catch (e) {
        console.error("Error loading posts from localStorage", e);
        this._myState.posts = []; // Reset posts if there's an error
      }
    }

    // Load ratings from localStorage
    const storedTeacherRatings = localStorage.getItem("teacherRatings");
    if (storedTeacherRatings) {
      try {
        this._myState.teacherRatings = JSON.parse(storedTeacherRatings);
      } catch (e) {
        console.error("Error loading teacher ratings from localStorage", e);
      }
    }

    const storedSubjectRatings = localStorage.getItem("subjectRatings");
    if (storedSubjectRatings) {
      try {
        this._myState.subjectRatings = JSON.parse(storedSubjectRatings);
      } catch (e) {
        console.error("Error loading subject ratings from localStorage", e);
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
