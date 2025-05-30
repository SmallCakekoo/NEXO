import { AppDispatcher, Action } from "./Dispatcher";
import { NavigateActionsType } from "./NavigationActions";
import { SignUpActionsType, SelectionActionsType } from "./Actions";
import { PostActionTypes } from "../types/feed/PostActionTypes";
import { Post } from "../types/feed/feeds.types";
import { AuthActionsType } from "./AuthActions";
import { SearchActionTypes } from "./SearchActions";
import { ProfileActionTypes } from "./ProfileActions";
import { CommentActionsType } from "./CommentActions";
import { FeedActionsType } from "./FeedActions";
import { TagActionTypes } from "../types/feed/TagActionTypes";

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

interface DeleteAccountSuccessPayload {
  username: string;
}

interface DeleteAccountErrorPayload {
  error: string;
}

interface SignUpErrorPayload {
  error: string;
}

interface PostModalPayload {
  postId: string;
}

interface TagPayload {
  tag: string;
}

interface PhotoPayload {
  photo: string;
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
  searchQuery: string;
  userLikes: { [userId: string]: string[] };
  comments: { [postId: string]: any[] };
  postModal: {
    isOpen: boolean;
    postId: string | null;
  };
  selectedTag: string;
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
    searchQuery: "",
    userLikes: {},
    comments: {},
    postModal: {
      isOpen: false,
      postId: null,
    },
    selectedTag: "All",
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
        if (action.payload) {
          const payload = action.payload as SignUpErrorPayload;
          this._myState = {
            ...this._myState,
            signUp: {
              loading: false,
              error: payload.error,
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
          "teacherName" in action.payload &&
          "rating" in action.payload &&
          "comment" in action.payload &&
          "timestamp" in action.payload
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
          // Cargar posts desde localStorage si existen
          const storedPosts = localStorage.getItem("posts");
          const posts = storedPosts ? JSON.parse(storedPosts) : action.payload;

          this._myState = {
            ...this._myState,
            posts: posts,
          };
          this._emitChange();
        }
        break;
      case PostActionTypes.ADD_POST:
        if (action.payload && typeof action.payload === "object") {
          const newPost = action.payload as Post;
          const updatedPosts = [newPost, ...this._myState.posts];

          // Actualizar localStorage y estado
          localStorage.setItem("posts", JSON.stringify(updatedPosts));
          this._myState = {
            ...this._myState,
            posts: updatedPosts,
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
      case SearchActionTypes.SEARCH_SUBJECTS:
      case SearchActionTypes.SEARCH_TEACHERS:
        if (action.payload && typeof action.payload === "object" && "query" in action.payload) {
          this._myState = {
            ...this._myState,
            searchQuery: String(action.payload.query),
          };
          this._emitChange();
        }
        break;

      case SearchActionTypes.CLEAR_SEARCH:
        this._myState = {
          ...this._myState,
          searchQuery: "",
        };
        this._emitChange();
        break;

      case ProfileActionTypes.DELETE_ACCOUNT_SUCCESS:
        if (action.payload) {
          const payload = action.payload as DeleteAccountSuccessPayload;
          this._myState = {
            ...this._myState,
            auth: {
              isAuthenticated: false,
              user: null,
            },
            posts: this._myState.posts.filter((post) => post.name !== payload.username),
            userLikes: {},
          };
        }
        this._emitChange();
        break;

      case ProfileActionTypes.DELETE_ACCOUNT_ERROR:
        if (action.payload) {
          const payload = action.payload as DeleteAccountErrorPayload;
          console.error("Error deleting account:", payload.error);
        }
        this._emitChange();
        break;

      case CommentActionsType.ADD_COMMENT:
        if (action.payload) {
          const currentPost = this._getCurrentPost();
          if (currentPost) {
            const postId = currentPost.id;
            const currentComments = this._myState.comments[postId] || [];
            this._myState = {
              ...this._myState,
              comments: {
                ...this._myState.comments,
                [postId]: [...currentComments, action.payload],
              },
            };
            // Persist comments to localStorage
            localStorage.setItem("comments", JSON.stringify(this._myState.comments));
            this._emitChange();
          }
        }
        break;

      case FeedActionsType.OPEN_POST_MODAL:
        this._myState = {
          ...this._myState,
          postModal: {
            isOpen: true,
            postId: (action.payload as PostModalPayload)?.postId || null,
          },
        };
        this._emitChange();
        break;

      case FeedActionsType.CLOSE_POST_MODAL:
        this._myState = {
          ...this._myState,
          postModal: {
            isOpen: false,
            postId: null,
          },
        };
        this._emitChange();
        break;

      case FeedActionsType.SHARE_POST:
        if (action.payload && typeof action.payload === "object" && "postId" in action.payload) {
          const payload = action.payload as PostModalPayload;
          const post = this._myState.posts.find((p) => p.id === payload.postId);
          if (post) {
            console.log("Compartiendo post:", post);
          }
        }
        break;

      case FeedActionsType.LOAD_POSTS_FROM_STORAGE:
        if (action.payload && typeof action.payload === "object" && "posts" in action.payload) {
          const payload = action.payload as { posts: Post[] };
          this._myState = {
            ...this._myState,
            posts: payload.posts
          };
          this._emitChange();
        }
        break;

      case TagActionTypes.SELECT_TAG:
        if (action.payload) {
          const tag = action.payload as string;
          console.log("Store: Changing selected tag to:", tag);
          this._myState = {
            ...this._myState,
            selectedTag: tag,
          };
          this._emitChange();
        }
        break;

      case ProfileActionTypes.UPDATE_PROFILE_PHOTO:
        if (action.payload && typeof action.payload === "object" && "photo" in action.payload) {
          const payload = action.payload as PhotoPayload;
          const user = this._myState.auth.user;
          if (user) {
            // Update user's profile picture in state
            this._myState = {
              ...this._myState,
              auth: {
                ...this._myState.auth,
                user: {
                  ...user,
                  profilePic: payload.photo,
                },
              },
            };

            // Update user's profile picture in localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(this._myState.auth.user));

            // Update in users array
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const idx = users.findIndex(
              (u: any) => u.username === user.username || u.email === user.email
            );
            if (idx !== -1) {
              users[idx].profilePic = payload.photo;
              localStorage.setItem("users", JSON.stringify(users));
            }

            // Update all posts for this user
            const posts = this._myState.posts.map((post) => {
              if (post.name === user.username) {
                return {
                  ...post,
                  photo: payload.photo,
                };
              }
              return post;
            });

            this._myState = {
              ...this._myState,
              posts,
            };

            localStorage.setItem("posts", JSON.stringify(posts));
            this._emitChange();
          }
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

  // Add new methods for localStorage management
  private _saveUserLikes(userId: string, postId: string, liked: boolean) {
    const userLikes = this._myState.userLikes[userId] || [];
    if (liked && !userLikes.includes(postId)) {
      userLikes.push(postId);
    } else if (!liked) {
      const index = userLikes.indexOf(postId);
      if (index > -1) {
        userLikes.splice(index, 1);
      }
    }
    this._myState.userLikes[userId] = userLikes;
    localStorage.setItem("userLikes", JSON.stringify(this._myState.userLikes));
    this._emitChange();
  }

  private _getUserLikes(userId: string): string[] {
    return this._myState.userLikes[userId] || [];
  }

  private _saveCurrentPost(post: any) {
    sessionStorage.setItem("currentPostId", post.id);
    sessionStorage.setItem("currentPost", JSON.stringify(post));
  }

  private _getCurrentPost(): any {
    const postStr = sessionStorage.getItem("currentPost");
    return postStr ? JSON.parse(postStr) : null;
  }

  private _setFromProfile(value: boolean) {
    sessionStorage.setItem("fromProfile", value.toString());
  }

  private _getFromProfile(): boolean {
    return sessionStorage.getItem("fromProfile") === "true";
  }

  // Add public methods to access the private ones
  saveUserLikes(userId: string, postId: string, liked: boolean) {
    this._saveUserLikes(userId, postId, liked);
  }

  getUserLikes(userId: string): string[] {
    return this._getUserLikes(userId);
  }

  saveCurrentPost(post: any) {
    this._saveCurrentPost(post);
  }

  getCurrentPost(): any {
    return this._getCurrentPost();
  }

  setFromProfile(value: boolean) {
    this._setFromProfile(value);
  }

  getFromProfile(): boolean {
    return this._getFromProfile();
  }

  // Update load method to include userLikes
  load(): void {
    try {
      // Cargar datos del usuario
      const user = localStorage.getItem("loggedInUser");
      if (user) {
        const parsedUser = JSON.parse(user);
        this._myState = {
          ...this._myState,
          auth: {
            isAuthenticated: true,
            user: parsedUser,
          },
        };

        // Si el usuario está en una ruta pública, redirigir al feed
        if (["/", "/login", "/signup"].includes(window.location.pathname)) {
          window.history.replaceState({}, "", "/feed");
          this._handleRouteChange("/feed");
        }
      }

      // Cargar posts
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        this._myState.posts = JSON.parse(storedPosts);
      }

      // Cargar ratings de profesores
      const storedTeacherRatings = localStorage.getItem("teacherRatings");
      if (storedTeacherRatings) {
        this._myState.teacherRatings = JSON.parse(storedTeacherRatings);
      }

      // Cargar ratings de materias
      const storedSubjectRatings = localStorage.getItem("subjectRatings");
      if (storedSubjectRatings) {
        this._myState.subjectRatings = JSON.parse(storedSubjectRatings);
      }

      // Cargar likes de usuarios
      const storedUserLikes = localStorage.getItem("userLikes");
      if (storedUserLikes) {
        this._myState.userLikes = JSON.parse(storedUserLikes);
      }

      // Cargar comentarios
      const storedComments = localStorage.getItem("comments");
      if (storedComments) {
        this._myState.comments = JSON.parse(storedComments);
      }

      // Sincronizar el estado con localStorage
      this.syncWithLocalStorage();

      this._emitChange();
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // Reiniciar el estado en caso de error
      this._myState = {
        ...this._myState,
        auth: {
          isAuthenticated: false,
          user: null,
        },
        posts: [],
        teacherRatings: {},
        subjectRatings: {},
        userLikes: {},
        comments: {},
      };
      this._emitChange();
    }
  }

  private syncWithLocalStorage(): void {
    // Sincronizar usuarios
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (this._myState.auth.user) {
      const currentUser = users.find((u: any) => u.username === this._myState.auth.user.username);
      if (!currentUser) {
        // Si el usuario no existe en la lista de usuarios, cerrar sesión
        this._myState.auth = {
          isAuthenticated: false,
          user: null,
        };
        localStorage.removeItem("loggedInUser");
      }
    }

    // Sincronizar posts con el usuario actual
    if (this._myState.auth.user) {
      this._myState.posts = this._myState.posts.filter((post) =>
        users.some((u: any) => u.username === post.name)
      );
    }

    // Sincronizar likes
    if (this._myState.auth.user) {
      const username = this._myState.auth.user.username;
      if (!this._myState.userLikes[username]) {
        this._myState.userLikes[username] = [];
      }
    }
  }

  // Método mejorado para obtener posts filtrados
  getFilteredPosts(tag: string = this._myState.selectedTag): Post[] {
    const posts = this._myState.posts;

    if (!posts || !Array.isArray(posts)) {
      return [];
    }

    if (tag === "All") {
      return [...posts];
    }

    // Normalizar el tag de búsqueda
    const searchTag = tag.toLowerCase().trim();

    return posts.filter((post) => {
      if (!post.tag) return false;

      // Normalizar el tag del post
      const postTag = post.tag.toLowerCase().trim();

      return postTag === searchTag;
    });
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
